import { basicCrudService, basicRelationService, twoWayRelationService } from "../../core/lib/express/service/common";
import { IPermission } from "../../lib/common/api/services/uac/permission/types";
import { IRole } from "../../lib/common/api/services/uac/role/types";
import { IUser, SafeUser } from "../../lib/common/api/services/uac/user/types";
import { User } from "../user/service";

export const Permission = {
    ...basicCrudService<IPermission>("permissions"),
    roles: basicRelationService<IRole>("rolePermissions", "permissionId", "roles", "roleId"),
    users: twoWayRelationService<SafeUser, IUser>("permissionId", "roleId", "userId", "rolePermissions", "userRoles", "users", User.makeSafe),
};
