import { database } from "../../core/lib/database";
import { basicCrudService, basicRelationService } from "../../core/lib/express/service/common";
import { IPermission } from "../../lib/common/api/services/uac/permission/types";
import { IRole } from "../../lib/common/api/services/uac/role/types";
import { IUser, SafeUser } from "../../lib/common/api/services/uac/user/types";
import { User } from "../user/service";

const db = database();

export const Role = {
    ...basicCrudService<IRole>("roles"),
    users: basicRelationService<SafeUser, IUser>("userRoles", "roleId", "users", "userId", User.makeSafe),
    permissions: basicRelationService<IPermission>("rolePermissions", "roleId", "permissions", "permissionId"),
}
