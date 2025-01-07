import { pipeTo } from "serverless-api-boilerplate";
import { pipe } from "ts-functional";
import { database } from '../../core/database';
import { HandlerArgs } from '../../core/express/types';
import { getBody, getBodyParam, getParam } from "../../core/express/util";
import { CheckPermissions } from "../permission/util";
import { User } from "./service";
import { IUser, NewUser, SafeUser } from "../../uac-shared/user/types";
import { Query } from "../../core-shared/express/types";

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
        return pipeTo(User.update, getBodyParam("userId"), getBody)(args);
    }

    @CheckPermissions("user.view")
    public get (...args:HandlerArgs<Query>):Promise<SafeUser> {
        return pipeTo(User.loadById, getParam("userID"))(args);
    }

    @CheckPermissions("user.delete")
    public remove (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(User.remove, getParam("userId"))(args);
    }

    @CheckPermissions("user.view", "role.view")
    public getRoles (...args:HandlerArgs<Query>): Promise<any[]> {
        return pipeTo(User.roles.get, pipe(getParam("userId"), parseInt))(args);
    }


    @CheckPermissions("user.update")
    public addRole (...args:HandlerArgs<Partial<IUser>>): Promise<any> {
        return pipeTo(User.roles.add, pipe(getParam("userId"), parseInt), pipe(getBodyParam("roleId"), parseInt))(args);
    }

    @CheckPermissions("user.update")
    public removeRole (...args:HandlerArgs<undefined>): Promise<any> {
        return pipeTo(User.roles.remove, pipe(getParam("userId"), parseInt), pipe(getParam("roleId"), parseInt))(args);
    }

    @CheckPermissions("user.view", "permission.view")
    public getPermissions (...args:HandlerArgs<Query>): Promise<any[]> {
        return pipeTo(User.permissions.get, pipe(getParam("userId"), parseInt))(args);
    }

    public forgotPassword(...args:HandlerArgs<Query>):Promise<any> {
        return pipeTo(User.forgotPassword, getBodyParam("userName"))(args);
    }

    public resetPassword(...args:HandlerArgs<Query>):Promise<any> {
        return pipeTo(User.resetPassword, getBodyParam("token"), getBodyParam("password"))(args);
    }

    public forgotUserName(...args:HandlerArgs<Query>):Promise<any> {
        return pipeTo(User.forgotUserName, getBodyParam("email"))(args);
    }
}

export const UserHandlers = new UserHandlerClass();
