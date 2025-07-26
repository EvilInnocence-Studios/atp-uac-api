import { Knex } from "knex"
import { IUser } from "../../uac-shared/user/types"
import { IRole } from "../../uac-shared/role/types";
import { IPermission } from "../../uac-shared/permissions/types";

export const insertUsers = async (db: Knex, users:Partial<IUser>[]):Promise<IUser[]> => 
    db.insert(users, "*").into("users");

export const insertRoles = async (db: Knex, roles:Partial<IRole>[]):Promise<IRole[]> =>
    db.insert(roles, "*").into("roles");

export const insertPermissions = async (db: Knex, permissions: Partial<IPermission>[]): Promise<IPermission[]> =>
    db.insert(permissions, "*").into("permissions").onConflict().ignore();

export const insertRolePermissions = async (db: Knex, rolePermissions: Array<{roleName: string, permissionName: string}>):Promise<void> => {
    const roleIds = await db.select("id").from("roles").whereIn("name", rolePermissions.map(r => r.roleName));
    const permissionIds = await db.select("id").from("permissions").whereIn("name", rolePermissions.map(r => r.permissionName));
    const rolePermissionData = roleIds.flatMap(role => permissionIds.map(permission => ({roleId: role.id, permissionId: permission.id})));
    await db.insert(rolePermissionData).into("rolePermissions");
};

export const insertUserRoles = async (db: Knex, userRoles: Array<{userName: string, roleName: string}>):Promise<void> => {
    const userIds = await db.select("id").from("users").whereIn("userName", userRoles.map(r => r.userName));
    const roleIds = await db.select("id").from("roles").whereIn("name", userRoles.map(r => r.roleName));
    const userRoleData = userIds.flatMap(user => roleIds.map(role => ({userId: user.id, roleId: role.id})));
    await db.insert(userRoleData).into("userRoles");
};


