import { pipeTo } from "serverless-api-boilerplate";
import { Query } from "../../core-shared/express/types";
import { database } from "../../core/database";
import { HandlerArgs } from "../../core/express/types";
import { getBody, getBodyParam, getParam, getQuery } from "../../core/express/extractors";
import { IPermission, NewPermission } from "../../uac-shared/permissions/types";
import { Permission } from "./service";
import { CheckPermissions } from "./util";
import { IRole } from "../../uac-shared/role/types";
import { Role } from "../role/service";

const db = database();

class PermissionHandlerClass {
    @CheckPermissions("permission.create")
    public create (...args:HandlerArgs<NewPermission>):Promise<IPermission> {
        return Permission.create(getBody(args));
    }

    @CheckPermissions("permission.view")
    public search (...args:HandlerArgs<Query>):Promise<IPermission[]> {
        return Permission.search(getQuery(args));
    }

    @CheckPermissions("permission.view")
    public get (...args:HandlerArgs<Query>):Promise<IPermission> {
        return pipeTo(Permission.loadById, getParam("permissionId"))(args);
    }

    @CheckPermissions("permission.update")
    public update (...args:HandlerArgs<Partial<IPermission>>):Promise<IPermission> {
        return pipeTo(Permission.update, getParam("permissionId"), getBody)(args);
    }

    @CheckPermissions("permission.delete")
    public remove (...args:HandlerArgs<undefined>):Promise<null> {
        return pipeTo(Permission.remove, getParam("permissionId"))(args);
    }

    public async default(...args:HandlerArgs<Query>):Promise<IPermission[]> {
        const publicRole = await Role.loadByName("Public");
        return Role.permissions.get(publicRole.id);
    }

    @CheckPermissions("permission.update")
    public searchRoles (...args:HandlerArgs<Query>):Promise<IRole[]> {
        return pipeTo(Permission.roles.get, getParam("permissionId"))(args);
    }

    @CheckPermissions("permission.update")
    public addRole (...args:HandlerArgs<number>):Promise<any> {
        return pipeTo(Permission.roles.add, getParam("permissionId"), getBodyParam("roleId"))(args);
    }

    @CheckPermissions("permission.update")
    public removeRole (...args:HandlerArgs<undefined>):Promise<any> {
        return pipeTo(Permission.roles.remove, getParam("permissionId"), getParam("roleId"))(args);
    }
}

export const PermissionHandlers = new PermissionHandlerClass();