import { database } from "../../core/database";
import { basicCrudService, basicRelationService } from "../../core/express/service/common";
import { IPermission } from "../../uac-shared/permissions/types";
import { IRole } from "../../uac-shared/role/types";
import { IUser, SafeUser } from "../../uac-shared/user/types";
import { User } from "../user/service";

const db = database();

export const Role = {
    ...basicCrudService<IRole>("roles"),
    users: basicRelationService<SafeUser, IUser>("userRoles", "roleId", "users", "userId", User.makeSafe),
    permissions: basicRelationService<IPermission>("rolePermissions", "roleId", "permissions", "permissionId"),
}
