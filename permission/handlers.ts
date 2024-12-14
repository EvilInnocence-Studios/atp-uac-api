import { pipeTo } from "serverless-api-boilerplate";
import { Query } from "../../core-shared/express/types";
import { database } from "../../core/database";
import { HandlerArgs } from "../../core/express/types";
import { getBody, getParam, getQuery } from "../../core/express/util";
import { IPermission, NewPermission } from "../../uac-shared/permissions/types";
import { Permission } from "./service";
import { CheckPermissions } from "./util";

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
}

export const PermissionHandlers = new PermissionHandlerClass();