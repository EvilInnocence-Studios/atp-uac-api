import { pipeTo } from "serverless-api-boilerplate";
import { Query } from "../../core-shared/express/types";
import { database } from '../../core/database';
import { HandlerArgs } from '../../core/express/types';
import { getBody, getBodyParam, getParam, getQueryParam } from "../../core/express/util";
import { IUser, NewUser, SafeUser } from "../../uac-shared/user/types";
import { CheckPermissions } from "../permission/util";
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

    @CheckPermissions("user.view")
    public getWishlists (...args:HandlerArgs<Query>): Promise<any[]> {
        return pipeTo(User.wishlists.get, getParam("userId"))(args);
    }

    @CheckPermissions("user.update")
    public addToWishlist (...args:HandlerArgs<Partial<IUser>>): Promise<any> {
        return pipeTo(User.wishlists.add, getParam("userId"), getBodyParam("productId"))(args);
    }

    @CheckPermissions("user.update")
    public removeFromWishlist (...args:HandlerArgs<undefined>): Promise<any> {
        return pipeTo(User.wishlists.remove, getParam("userId"), getParam("productId"))(args);
    }

    public forgotPassword(...args:HandlerArgs<Query>):Promise<any> {
        return pipeTo(User.forgotPassword, getBodyParam("userName"))(args);
    }

    public resetPassword(...args:HandlerArgs<Query>):Promise<any> {
        return pipeTo(User.resetPassword, getBodyParam("token"), getBodyParam("newPassword"))(args);
    }

    public createPasswordResetToken(...args:HandlerArgs<Query>):Promise<string> {
        return pipeTo(User.createPasswordResetToken, getQueryParam("userName"))(args);
    }

    public forgotUserName(...args:HandlerArgs<Query>):Promise<any> {
        return pipeTo(User.forgotUserName, getBodyParam("email"))(args);
    }
}

export const UserHandlers = new UserHandlerClass();
