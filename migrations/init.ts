import dayjs from "dayjs";
import { database } from "../../core/database";
import { IMigration } from "../../core/database.d";
import { IPermission } from "../../uac-shared/permissions/types";
import { IRole } from "../../uac-shared/role/types";
import { IUser } from "../../uac-shared/user/types";
import { User } from "../user/service";

const db = database();

const userBlanks = {firstName: "", lastName: "", prefix: "", suffix: "", createdAt: dayjs().toISOString()};
const users:IUser[] = [
    {id: 1, userName: "admin",  email: "admin@example.com", passwordHash: User.hashPassword("admin"), mustUpdatePassword: true, ...userBlanks},
    {id: 2, userName: "public", email: "",                  passwordHash: "",                         mustUpdatePassword: false, ...userBlanks},
];

const roles:IRole[] = [
    {id: 1, name: "SuperUser", description: "SuperUser role"    },
    {id: 2, name: "Public",    description: "Non-logged in user"},
    {id: 3, name: "Customer",  description: "Store customer"    },
    {id: 4, name: "BSP",       description: "BSP subscriber"    },
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

    {id: 13, name: "tag.view",          description: "Can view tags"         },
    {id: 14, name: "tag.update",        description: "Can update tags"       },
    {id: 15, name: "tag.create",        description: "Can create tags"       },
    {id: 16, name: "tag.delete",        description: "Can delete tags"       },

    {id: 17, name: "product.view",      description: "Can view products"     },
    {id: 18, name: "product.update",    description: "Can update products"   },
    {id: 19, name: "product.create",    description: "Can create products"   },
    {id: 20, name: "product.delete",    description: "Can delete products"   },

    {id: 21, name: "media.view",        description: "Can view media"        },
    {id: 22, name: "media.update",      description: "Can update media"      },
    {id: 23, name: "media.create",      description: "Can create media"      },
    {id: 24, name: "media.delete",      description: "Can delete media"      },

    {id: 25, name: "synonym.view",      description: "Can view synonyms"     },
    {id: 26, name: "synonym.update",    description: "Can update synonyms"   },
    {id: 27, name: "synonym.create",    description: "Can create synonyms"   },
    {id: 28, name: "synonym.delete",    description: "Can delete synonyms"   },

    {id: 29, name: "banner.view",       description: "Can view banners"      },
    {id: 30, name: "banner.update",     description: "Can update banners"    },
    {id: 31, name: "banner.create",     description: "Can create banners"    },
    {id: 32, name: "banner.delete",     description: "Can delete banners"    },

    {id: 33, name: "order.view",        description: "Can view orders"       },
    {id: 34, name: "order.update",      description: "Can update orders"     },
    {id: 35, name: "order.create",      description: "Can create orders"     },
    {id: 36, name: "order.delete",      description: "Can delete orders"     },
];

const rolePermissions = [
    // Super user gets all permissions
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
    {roleId: 1, permissionId: 13},
    {roleId: 1, permissionId: 14},
    {roleId: 1, permissionId: 15},
    {roleId: 1, permissionId: 16},
    {roleId: 1, permissionId: 17},
    {roleId: 1, permissionId: 18},
    {roleId: 1, permissionId: 19},
    {roleId: 1, permissionId: 20},
    {roleId: 1, permissionId: 21},
    {roleId: 1, permissionId: 22},
    {roleId: 1, permissionId: 23},
    {roleId: 1, permissionId: 24},
    {roleId: 1, permissionId: 25},
    {roleId: 1, permissionId: 26},
    {roleId: 1, permissionId: 27},
    {roleId: 1, permissionId: 28},
    {roleId: 1, permissionId: 29},
    {roleId: 1, permissionId: 30},
    {roleId: 1, permissionId: 31},
    {roleId: 1, permissionId: 32},
    {roleId: 1, permissionId: 33},
    {roleId: 1, permissionId: 34},
    {roleId: 1, permissionId: 35},
    {roleId: 1, permissionId: 36},

    // Public user gets only public view permissions
    {roleId: 2, permissionId:  3},
    {roleId: 2, permissionId: 13},
    {roleId: 2, permissionId: 17},
    {roleId: 2, permissionId: 21},
    {roleId: 2, permissionId: 25},
    {roleId: 2, permissionId: 29},

    // Customer gets only customer view permissions
    {roleId: 3, permissionId:  3},
    {roleId: 3, permissionId: 13},
    {roleId: 3, permissionId: 17},
    {roleId: 3, permissionId: 21},
    {roleId: 3, permissionId: 25},
    {roleId: 3, permissionId: 29},
    {roleId: 3, permissionId: 33},
    {roleId: 3, permissionId: 34},
    {roleId: 3, permissionId: 35},
    {roleId: 3, permissionId: 36},
    // TODO: Need to add account permissions
];

const userRoles = [
    {userId: 1, roleId: 1},
    {userId: 2, roleId: 2},
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
            t.string( "userName",      255).notNullable().unique();
            t.string( "email",         255).notNullable().unique();
            t.string("prefix"             ).notNullable().defaultTo("");
            t.string("firstName"          ).notNullable().defaultTo("");
            t.string("lastName"           ).notNullable().defaultTo("");
            t.string("suffix"             ).notNullable().defaultTo("");
            t.string( "passwordHash",   64).notNullable();
            t.boolean("mustUpdatePassword").notNullable();
            t.dateTime("createdAt"        ).notNullable().defaultTo(db.fn.now());
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
        }),
    priority: 0,
    initData: () => Promise.all([
        db.insert(            users).into("users"          ),
        db.insert(            roles).into("roles"          ),
        db.insert(      permissions).into("permissions"    ),
        db.insert(  rolePermissions).into("rolePermissions"),
        db.insert(        userRoles).into("userRoles"      ),
        db.raw("ALTER SEQUENCE users_id_seq RESTART WITH 3"),
        db.raw("ALTER SEQUENCE roles_id_seq RESTART WITH 5"),
        db.raw("ALTER SEQUENCE permissions_id_seq RESTART WITH 29"),
    ]),
}
