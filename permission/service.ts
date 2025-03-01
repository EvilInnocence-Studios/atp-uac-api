import { basicCrudService, basicRelationService, twoWayRelationService } from "../../core/express/service/common";
import { IPermission } from "../../uac-shared/permissions/types";
import { IRole } from "../../uac-shared/role/types";
import { IUser, SafeUser } from "../../uac-shared/user/types";
import { User } from "../user/service";

export const Permission = {
    ...basicCrudService<IPermission>("permissions"),
    roles: basicRelationService<IRole>("rolePermissions", "permissionId", "roles", "roleId"),
    users: twoWayRelationService<SafeUser, IUser>("permissionId", "roleId", "userId", "rolePermissions", "userRoles", "users", {afterLoad: User.makeSafe}),
};
