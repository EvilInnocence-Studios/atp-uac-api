import { pipeTo } from "ts-functional";
import { prop } from "ts-functional";
import { Query } from "../../core-shared/express/types";
import { database } from '../../core/database';
import { getBody, getBodyParam, getParam, getQueryParam, getUserPermissions } from "../../core/express/extractors";
import { HandlerArgs } from '../../core/express/types';
import { IUser, NewUser, SafeUser } from "../../uac-shared/user/types";
import { CheckPermissions, hasPermission } from "../permission/util";
import { User } from "./service";

const db = database();

class UserHandlerClass  {
    @CheckPermissions("user.create")
    public create (...args:HandlerArgs<NewUser>):Promise<SafeUser> {
        return User.create(getBody(args));
    }

    @CheckPermissions("user.view")
    public search (...args:HandlerArgs<Query>):Promise<SafeUser[]> {
        return User.search(getBody(args));
    }

    @CheckPermissions("user.update")
    public update (...args:HandlerArgs<Partial<IUser>>):Promise<SafeUser> { 
        return pipeTo(User.update, getParam("userId"), getBody)(args);
    }

    @CheckPermissions("user.view")
    public get (...args:HandlerArgs<Query>):Promise<SafeUser> {
        return pipeTo(User.loadById, getParam("userId"))(args);
    }

    @CheckPermissions("user.delete")
    public remove (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(User.remove, getParam("userId"))(args);
    }

    @CheckPermissions("user.view", "role.view")
    public getRoles (...args:HandlerArgs<Query>): Promise<any[]> {
        return pipeTo(User.roles.get, getParam("userId"))(args);
    }


    @CheckPermissions("user.update")
    public addRole (...args:HandlerArgs<Partial<IUser>>): Promise<any> {
        return pipeTo(User.roles.add, getParam("userId"), getBodyParam("roleId"))(args);
    }

    @CheckPermissions("user.update")
    public removeRole (...args:HandlerArgs<undefined>): Promise<any> {
        return pipeTo(User.roles.remove, getParam("userId"), getParam("roleId"))(args);
    }

    @CheckPermissions("user.view", "permission.view")
    public getPermissions (...args:HandlerArgs<Query>): Promise<any[]> {
        return pipeTo(User.permissions.get, getParam("userId"))(args);
    }

    @CheckPermissions("wishlist.view")
    public async getWishlists (...args:HandlerArgs<Query>): Promise<any[]> {
        const wishlistItems = await pipeTo(User.wishlists.get, getParam("userId"))(args);

        const userPermissions = await getUserPermissions(args);
        return hasPermission(["product.disabled"], userPermissions)
            ? wishlistItems
            : (wishlistItems).filter(prop("enabled"));
    }

    @CheckPermissions("wishlist.create")
    public addToWishlist (...args:HandlerArgs<Partial<IUser>>): Promise<any> {
        return pipeTo(User.wishlists.add, getParam("userId"), getBodyParam("productId"))(args);
    }

    @CheckPermissions("wishlist.delete")
    public removeFromWishlist (...args:HandlerArgs<undefined>): Promise<any> {
        return pipeTo(User.wishlists.remove, getParam("userId"), getParam("productId"))(args);
    }

    public resetPassword(...args:HandlerArgs<Query>):Promise<any> {
        return pipeTo(User.resetPassword, getBodyParam("token"), getBodyParam("newPassword"))(args);
    }

    public resetPasswordByUser(...args:HandlerArgs<Query>):Promise<any> {
        return pipeTo(User.resetPasswordByUser, getParam("userId"), getBodyParam("oldPassword"), getBodyParam("newPassword"))(args);
    }

    public createPasswordResetToken(...args:HandlerArgs<Query>):Promise<string> {
        return pipeTo(User.createPasswordResetToken, getQueryParam("userName"))(args);
    }

    public forgotLogin(...args:HandlerArgs<Query>):Promise<any> {
        return pipeTo(User.forgotLogin, getBodyParam("email"))(args);
    }

    @CheckPermissions("user.update")
    public subscribe (...args:HandlerArgs<Partial<IUser>>): Promise<any> {
        return pipeTo(User.subscribe, getParam("userId"), getBodyParam("subscriptionId"))(args);
    }

    @CheckPermissions("user.update")
    public unsubscribe (...args:HandlerArgs<undefined>): Promise<any> {
        return pipeTo(User.unsubscribe, getParam("userId"))(args);
    }
}

export const UserHandlers = new UserHandlerClass();
