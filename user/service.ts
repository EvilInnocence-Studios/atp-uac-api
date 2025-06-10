import sha256 from 'crypto-js/sha256';
import jwt from "jsonwebtoken";
import { omit } from "ts-functional";
import { getAppConfig, salt, secret } from '../../../config';
import { database } from '../../core/database';
import { error403 } from '../../core/express/errors';
import { basicCrudService, basicRelationService, twoWayRelationService } from '../../core/express/service/common';
import { loadBy, loadById, loadByInsensitive } from '../../core/express/util';
import { subscription } from '../../core/paypal';
import { render } from "../../core/render";
import { sendEmail } from "../../core/sendEmail";
import { IProduct } from "../../store-shared/product/types";
import { IPermission } from '../../uac-shared/permissions/types';
import { IRole } from '../../uac-shared/role/types';
import { IUser, NewUser, SafeUser, UserUpdate } from '../../uac-shared/user/types';
import { CancelSubscription } from "../components/cancelSubscription";
import { ForgotLogin } from "../components/forgotLogin";
import { NewAccount } from '../components/newAccount';
import { RoleChange } from "../components/roleChange";
import { UserNotFound } from "../components/userNotFound";
import { Role } from '../role/service';

const makeSafe = (user:IUser):SafeUser => omit<IUser, "passwordHash">("passwordHash")(user) as SafeUser;
const removePassword = omit<Partial<UserUpdate>, "password">("password");

// TODO: Figure out the type for this
//const hashUserPassword = (user:NewUser | UserUpdate):Partial<IUser> => user.password
const hashUserPassword = (user:any):any => user.password
    ? {...removePassword(user), passwordHash: sha256(salt + user.password).toString() }
    : removePassword(user);

const afterUserCreate = async (user:IUser) => {
    //  Assign a default role
    const roleId = getAppConfig().defaultUserRoleId;
    await User.roles.add(user.id, roleId);

    // Send an account create email
    const html = render(NewAccount, {user});
    sendEmail(getAppConfig().emailTemplates.newAccount.subject, html, [user.email, getAppConfig().supportEmail]);
}

const db = database();

const sendRoleChangeEmail = async (userId: string, roleId: string, action: "add" | "remove") => {
    const user:SafeUser = await User.loadById(userId);
    const role:IRole = await Role.loadById(roleId);
    const html = render(RoleChange, { role, action });
    return sendEmail(getAppConfig().emailTemplates.roleChange.subject, html, [user.email, getAppConfig().supportEmail]);
};

export const makeUserSafe = (user:IUser):SafeUser =>
    omit<IUser, "passwordHash">("passwordHash")(user) as SafeUser;

export const User = {
    ...basicCrudService<IUser, NewUser, UserUpdate, SafeUser>("users", "userName", {
        afterLoad: makeSafe,
        beforeCreate: hashUserPassword,
        beforeUpdate: hashUserPassword,
        afterCreate: afterUserCreate,
    }),
    loadUnsafe:                  loadById<IUser>("users"),
    loadUnsafeByName:            loadBy<IUser>("userName", "users"),
    loadUnsafeByNameInsensitive: loadByInsensitive<IUser>("userName", "users"),

    roles: basicRelationService<IRole>("userRoles", "userId", "roles", "roleId", {
        afterAdd: (userId: string, roleId: string) => 
            sendRoleChangeEmail(userId, roleId, "add" as "add"),
        afterRemove: (userId: string, roleId: string) => 
            sendRoleChangeEmail(userId, roleId, "removed" as "remove"),
    }),
    permissions: twoWayRelationService<IPermission>("userId", "roleId", "permissionId", "userRoles", "rolePermissions", "permissions"),
    wishlists: basicRelationService<IProduct>("wishlists", "userId", "products", "productId"),

    getLoggedInUser: (token:string):string | null => {
        console.log(token);
        if(!token) return null;
        const userId = jwt.verify(token, secret) as string;
        return userId;
    },

    makeSafe: makeUserSafe,
    hashPassword: (str:string) => sha256(salt + str).toString(),

    createPasswordResetToken: async (userName:string):Promise<string> => {
        return jwt.sign({userName}, secret, {expiresIn: "1h"});
    },

    forgotLogin: async (email:string):Promise<any> => {
        const user = await User.loadByInsensitive("email")(email);
    
        if(!user) {
            console.log("User not found");
            const html = render(UserNotFound, {email});
            sendEmail(getAppConfig().emailTemplates.forgotLogin.subject, html, [email, getAppConfig().supportEmail]);
        }

        // Generate a key for the reset password link
        const token = jwt.sign({email: user.email, userName: user.userName}, secret, {expiresIn: "1h"});

        // Get the forgot login template
        const html = render(ForgotLogin,  {email: user.email, userName: user.userName, token});
        sendEmail(getAppConfig().emailTemplates.forgotLogin.subject, html, [email, getAppConfig().supportEmail]);

    },

    resetPassword: async (token:string, newPassword: string):Promise<any> => {
        // Verify the token
        const {userName} = jwt.verify(token, secret) as {userName: string};

        if(!userName) {
            throw error403;
        }

        // Update the user with the new password
        await db("users")
            .update({passwordHash: User.hashPassword(newPassword)})
            .where({userName});
    },

    resetPasswordByUser: async (userId:string, oldPassword:string, newPassword:string):Promise<any> => {
        // Get the user from the database
        const user = await User.loadUnsafe(userId);
        if(user.passwordHash !== User.hashPassword(oldPassword)) {
            throw error403;
        }
        // Update the user with the new password
        await db("users")
            .update({passwordHash: User.hashPassword(newPassword)})
            .where({id: userId});
    },

    subscribe: async (userId:string, subscriptionId:string):Promise<any> => {
        await db("users")
            .update({subscriptionId})
            .where({id: userId});

        await User.roles.add(userId, getAppConfig().subscriptionRoleId);
    },

    unsubscribe: async (userId:string):Promise<any> => {
        // Get the subscription ID from the database
        const subscriptionId = await User.loadById(userId).then(user => user.subscriptionId);
        if(subscriptionId) {
            // Cancel the subscription with PayPal
            await subscription.cancel(subscriptionId);
        } else {
            const html = render(CancelSubscription, {user: await User.loadById(userId)});
            sendEmail("Subscription Cancelled", html, [getAppConfig().supportEmail]);
        }
        
        
        // Remove the subscription ID from the database
        await db("users")
            .update({subscriptionId: null})
            .where({id: userId});

        // Remove the subscription role from the user
        await User.roles.remove(userId, getAppConfig().subscriptionRoleId);
    },
};
