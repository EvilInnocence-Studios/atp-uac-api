import { getBodyParam, pipeTo } from "serverless-api-boilerplate";
import { pipe } from "ts-functional";
import { CheckPermissions } from "../permission/util";
import { Role } from "./service";
import { HandlerArgs } from "../../core/express/types";
import { IRole, NewRole } from "../../uac-shared/role/types";
import { getBody, getParam, getQuery } from "../../core/express/util";
import { Query } from "../../core-shared/express/types";
import { IPermission } from "../../uac-shared/permissions/types";

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
        return pipeTo(Role.update, getBody<Partial<IRole>>)(args);
    }

    @CheckPermissions("role.delete")
    public remove(...args:HandlerArgs<undefined>):Promise<any> {
        return pipeTo(Role.remove, pipe(getParam("roleId"), parseInt))(args);
    }

    @CheckPermissions("role.view", "permission.view")
    public getPermissions(...args:HandlerArgs<Query>):Promise<IPermission[]> {
        return pipeTo(Role.permissions.get, pipe(getParam("roleId"), parseInt))(args);
    }

    @CheckPermissions("role.update", "permission.create")
    public addPermission(...args:HandlerArgs<Query>):Promise<any> {
        return pipeTo(Role.permissions.add, pipe(getParam("roleId"), parseInt), getBodyParam("roleId"))(args);
    }

    @CheckPermissions("role.update", "permission.delete")
    public removePermission(...args:HandlerArgs<undefined>):Promise<any> {
        return pipeTo(Role.permissions.remove, pipe(getParam("roleId"), parseInt), pipe(getParam("permissionId"), parseInt))(args);
    }
}

export const RoleHandlers = new RoleHandlersClass();
