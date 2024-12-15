import { database } from "../../core/database";
import { IMigration } from "../../core/database.d";
import { IPermission } from "../../uac-shared/permissions/types";
import { IRole } from "../../uac-shared/role/types";
import { IUser } from "../../uac-shared/user/types";
import { User } from "../user/service";

const db = database();

const users:IUser[] = [
    {id: 1, userName: "admin", passwordHash: User.hashPassword("admin"), mustUpdatePassword: true},
];

const roles:IRole[] = [
    {id: 1, name: "SuperUser", description: "SuperUser role"},
];

const permissions:IPermission[] = [
    {id:  1, name: "user.view",         description: "Can view users"        },
    {id:  2, name: "user.update",       description: "Can update users"      },
    {id:  3, name: "user.create",       description: "Can create users"      },
    {id:  4, name: "user.delete",       description: "Can delete users"      },
    {id:  5, name: "role.view",         description: "Can view roles"        },
    {id:  6, name: "role.update",       description: "Can update roles"      },
    {id:  7, name: "role.create",       description: "Can create roles"      },
    {id:  8, name: "role.delete",       description: "Can delete roles"      },
    {id:  9, name: "permission.view",   description: "Can view permissions"  },
    {id: 10, name: "permission.update", description: "Can update permissions"},
    {id: 11, name: "permission.create", description: "Can create permissions"},
    {id: 12, name: "permission.delete", description: "Can delete permissions"},
];

const rolePermissions = [
    {roleId: 1, permissionId:  1},
    {roleId: 1, permissionId:  2},
    {roleId: 1, permissionId:  3},
    {roleId: 1, permissionId:  4},
    {roleId: 1, permissionId:  5},
    {roleId: 1, permissionId:  6},
    {roleId: 1, permissionId:  7},
    {roleId: 1, permissionId:  8},
    {roleId: 1, permissionId:  9},
    {roleId: 1, permissionId: 10},
    {roleId: 1, permissionId: 11},
    {roleId: 1, permissionId: 12},
];

const userRoles = [
    {userId: 1, roleId: 1},
];

export const init:IMigration = {
    down: () => db.schema
        // Drop tables in reverse order to ensure foreign key constraints don't stop things
        .dropTableIfExists("userRoles")
        .dropTableIfExists("rolePermissions")
        .dropTableIfExists("roles")
        .dropTableIfExists("permissions")
        .dropTableIfExists("users"),

    up: () => db.schema
        // Users table
        .createTable("users", t => {
            t.increments().unsigned();
            t.string( "userName",    255).notNullable().unique();
            t.string( "passwordHash", 64).notNullable();
            t.boolean("mustUpdatePassword").notNullable();
        })
        .createTable("roles", t => {
            t.increments().unsigned();
            t.string("name",         64).notNullable().unique();
            t.string("description", 255);
        })
        .createTable("permissions", t => {
            t.increments().unsigned();
            t.string("name",         64).notNullable().unique();
            t.string("description", 255);
        })
        .createTable("rolePermissions", t => {
            t.integer("roleId"      ).unsigned().notNullable().references("id").inTable("roles"      ).onDelete("CASCADE");
            t.integer("permissionId").unsigned().notNullable().references("id").inTable("permissions").onDelete("CASCADE");
            t.unique(["roleId", "permissionId"]);
        })
        .createTable("userRoles", t => {
            t.integer("roleId").unsigned().notNullable().references("id").inTable("roles").onDelete("CASCADE");
            t.integer("userId").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
            t.unique(["roleId", "userId"]);
        })
    .then(() => Promise.all([
        db.insert(            users).into("users"          ),
        db.insert(            roles).into("roles"          ),
        db.insert(      permissions).into("permissions"    ),
        db.insert(  rolePermissions).into("rolePermissions"),
        db.insert(        userRoles).into("userRoles"      ),
        db.raw("ALTER SEQUENCE users_id_seq RESTART WITH 2"),
        db.raw("ALTER SEQUENCE roles_id_seq RESTART WITH 2"),
        db.raw("ALTER SEQUENCE permissions_id_seq RESTART WITH 13"),
    ])),
}
