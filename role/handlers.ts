import { pipeTo } from "serverless-api-boilerplate";
import { pipe } from "ts-functional";
import { Query } from "../../core-shared/express/types";
import { HandlerArgs } from "../../core/express/types";
import { getBody, getBodyParam, getParam, getQuery } from "../../core/express/util";
import { IPermission } from "../../uac-shared/permissions/types";
import { IRole, NewRole } from "../../uac-shared/role/types";
import { CheckPermissions } from "../permission/util";
import { Role } from "./service";

class RoleHandlersClass {
    @CheckPermissions("role.create")
    public create(...args:HandlerArgs<NewRole>):Promise<IRole> {
        return Role.create(getBody<NewRole>(args));
    }

    @CheckPermissions("role.view")
    public search(...args:HandlerArgs<Query>):Promise<IRole[]> {
        return Role.search(getQuery(args));
    }

    @CheckPermissions("role.view")
    public get(...args:HandlerArgs<Query>):Promise<IRole> {
        return pipeTo(Role.loadById, pipe(getParam("roleId"), parseInt))(args);
    }

    @CheckPermissions("role.update")
    public update(...args:HandlerArgs<Partial<IRole>>):Promise<IRole> {
        return pipeTo(Role.update, getParam("roleId"), getBody<Partial<IRole>>)(args);
    }

    @CheckPermissions("role.delete")
    public remove(...args:HandlerArgs<undefined>):Promise<any> {
        return pipeTo(Role.remove, getParam("roleId"))(args);
    }

    @CheckPermissions("role.view", "permission.view")
    public getPermissions(...args:HandlerArgs<Query>):Promise<IPermission[]> {
        return pipeTo(Role.permissions.get, pipe(getParam("roleId"), parseInt))(args);
    }

    @CheckPermissions("role.update")
    public addPermission(...args:HandlerArgs<number>):Promise<any> {
        return pipeTo(Role.permissions.add, getParam("roleId"), getBodyParam("permissionId"))(args);
    }

    @CheckPermissions("role.update")
    public removePermission(...args:HandlerArgs<undefined>):Promise<any> {
        return pipeTo(Role.permissions.remove, pipe(getParam("roleId"), parseInt), pipe(getParam("permissionId"), parseInt))(args);
    }
}

export const RoleHandlers = new RoleHandlersClass();
