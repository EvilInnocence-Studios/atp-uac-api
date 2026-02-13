import dayjs from "dayjs";
import { database } from "../../../core/database";
import { User } from "../../user/service";
import { permissionsTable, rolePermissionsTable, rolesTable, userRolesTable, usersTable } from "../tables";
import { insertRolePermissions, insertUsers, insertUserRoles, insertRoles, insertPermissions } from "../util";
import { IMigration } from "@core/dbMigrations";

const db = database();

const userBlanks = { firstName: "", lastName: "", prefix: "", suffix: "", createdAt: dayjs().toISOString() };
export const users = [
    { userName: "admin", email: "admin@example.com", passwordHash: User.hashPassword("admin"), mustUpdatePassword: true, ...userBlanks },
    { userName: "public", email: "", passwordHash: "", mustUpdatePassword: false, ...userBlanks },
];

const roles = [
    { name: "SuperUser", description: "SuperUser role" },
    { name: "Public", description: "Non-logged in user" },
];

const permissions = [
    { name: "user.view", description: "Can view users" },
    { name: "user.update", description: "Can update users" },
    { name: "user.create", description: "Can create users" },
    { name: "user.delete", description: "Can delete users" },
    { name: "user.admin", description: "Can administer users" },
    { name: "role.view", description: "Can view roles" },
    { name: "role.update", description: "Can update roles" },
    { name: "role.create", description: "Can create roles" },
    { name: "role.delete", description: "Can delete roles" },
    { name: "permission.view", description: "Can view permissions" },
    { name: "permission.update", description: "Can update permissions" },
    { name: "permission.create", description: "Can create permissions" },
    { name: "permission.delete", description: "Can delete permissions" },
];

const rolePermissions = [
    { roleName: "SuperUser", permissionName: "user.view" },
    { roleName: "SuperUser", permissionName: "user.update" },
    { roleName: "SuperUser", permissionName: "user.create" },
    { roleName: "SuperUser", permissionName: "user.delete" },
    { roleName: "SuperUser", permissionName: "user.admin" },
    { roleName: "SuperUser", permissionName: "role.view" },
    { roleName: "SuperUser", permissionName: "role.update" },
    { roleName: "SuperUser", permissionName: "role.create" },
    { roleName: "SuperUser", permissionName: "role.delete" },
    { roleName: "SuperUser", permissionName: "permission.view" },
    { roleName: "SuperUser", permissionName: "permission.update" },
    { roleName: "SuperUser", permissionName: "permission.create" },
    { roleName: "SuperUser", permissionName: "permission.delete" },
    { roleName: "Public", permissionName: "user.create" },
];

export const userRoles = [
    { userName: "admin", roleName: "SuperUser" },
    { userName: "public", roleName: "Public" },
];

export const init: IMigration = {
    name: "init",
    module: "uac",
    description: "Install the uac module",
    version: "1.0.0",
    order: 0,
    down: () => db.schema
        // Drop tables in reverse order to ensure foreign key constraints don't stop things
        .dropTableIfExists("userRoles")
        .dropTableIfExists("rolePermissions")
        .dropTableIfExists("roles")
        .dropTableIfExists("permissions")
        .dropTableIfExists("users"),

    up: () => db.schema
        // Users table
        .createTable("users", usersTable)
        .createTable("roles", rolesTable)
        .createTable("permissions", permissionsTable)
        .createTable("rolePermissions", rolePermissionsTable)
        .createTable("userRoles", userRolesTable),
    initData: async () => {
        await insertUsers(db, users);
        await insertRoles(db, roles);
        await insertPermissions(db, permissions);
        await insertRolePermissions(db, rolePermissions);
        await insertUserRoles(db, userRoles);
    },
}
