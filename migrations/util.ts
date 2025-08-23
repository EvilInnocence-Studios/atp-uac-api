import { Knex } from "knex";
import { IPermission } from "../../uac-shared/permissions/types";
import { IRole } from "../../uac-shared/role/types";
import { IUser } from "../../uac-shared/user/types";
import { Permission } from "../../uac/permission/service";
import { Role } from "../../uac/role/service";
import { User } from "../../uac/user/service";

export const insertUsers = async (db: Knex, users:Partial<IUser>[]):Promise<IUser[]> => 
    db.insert(users, "*").into("users");

export const insertRoles = async (db: Knex, roles:Partial<IRole>[]):Promise<IRole[]> =>
    db.insert(roles, "*").into("roles");

export const insertPermissions = async (db: Knex, permissions: Partial<IPermission>[]): Promise<IPermission[]> =>
    db.insert(permissions, "*").into("permissions").onConflict().ignore();

export const insertRolePermissions = async (db: Knex, rolePermissions: Array<{roleName: string, permissionName: string}>):Promise<any> => 
    Promise.all(rolePermissions.map(async (rp) => {
        console.log(`Inserting role permission: ${rp.roleName} -> ${rp.permissionName}`); // Debugging log
        const roleId = (await Role.loadByName(rp.roleName)).id;
        const permissionId = (await Permission.loadByName(rp.permissionName)).id;
        return db.insert({roleId, permissionId}, "*").into("rolePermissions").onConflict().ignore();
    }));

export const insertUserRoles = async (db: Knex, userRoles: Array<{userName: string, roleName: string}>):Promise<any> => 
    Promise.all(userRoles.map(async (ur) => {
        console.log(`Inserting user role: ${ur.userName} -> ${ur.roleName}`); // Debugging log
        const userId = (await User.loadByName(ur.userName)).id;
        const roleId = (await Role.loadByName(ur.roleName)).id;
        return db.insert({userId, roleId}, "*").into("userRoles").onConflict().ignore();
    }));
