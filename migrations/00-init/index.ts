import dayjs from "dayjs";
import { database } from "../../../core/database";
import { IMigration } from "../../../core/database.d";
import { User } from "../../user/service";
import { permissionsTable, rolePermissionsTable, rolesTable, userRolesTable, usersTable } from "../tables";
import { insertRolePermissions, insertUsers, insertUserRoles, insertRoles, insertPermissions } from "../util";

const db = database();

const userBlanks = {firstName: "", lastName: "", prefix: "", suffix: "", createdAt: dayjs().toISOString()};
export const users = [
    {userName: "admin",  email: "admin@example.com", passwordHash: User.hashPassword("admin"), mustUpdatePassword: true, ...userBlanks},
    {userName: "public", email: "",                  passwordHash: "",                         mustUpdatePassword: false, ...userBlanks},
];

const roles = [
    { name: "SuperUser", description: "SuperUser role"    },
    { name: "Public",    description: "Non-logged in user"},
    { name: "Customer",  description: "Store customer"    },
    { name: "BSP",       description: "BSP subscriber"    },
];

const permissions = [
    { name: "user.view",            description: "Can view users"        },
    { name: "user.update",          description: "Can update users"      },
    { name: "user.create",          description: "Can create users"      },
    { name: "user.delete",          description: "Can delete users"      },
    { name: "role.view",            description: "Can view roles"        },
    { name: "role.update",          description: "Can update roles"      },
    { name: "role.create",          description: "Can create roles"      },
    { name: "role.delete",          description: "Can delete roles"      },
    { name: "permission.view",      description: "Can view permissions"  },
    { name: "permission.update",    description: "Can update permissions"},
    { name: "permission.create",    description: "Can create permissions"},
    { name: "permission.delete",    description: "Can delete permissions"},

    { name: "tag.view",             description: "Can view tags"         },
    { name: "tag.update",           description: "Can update tags"       },
    { name: "tag.create",           description: "Can create tags"       },
    { name: "tag.delete",           description: "Can delete tags"       },

    { name: "product.view",         description: "Can view products"     },
    { name: "product.update",       description: "Can update products"   },
    { name: "product.create",       description: "Can create products"   },
    { name: "product.delete",       description: "Can delete products"   },

    { name: "media.view",           description: "Can view media"        },
    { name: "media.update",         description: "Can update media"      },
    { name: "media.create",         description: "Can create media"      },
    { name: "media.delete",         description: "Can delete media"      },

    { name: "synonym.view",         description: "Can view synonyms"     },
    { name: "synonym.update",       description: "Can update synonyms"   },
    { name: "synonym.create",       description: "Can create synonyms"   },
    { name: "synonym.delete",       description: "Can delete synonyms"   },

    { name: "banner.view",          description: "Can view banners"      },
    { name: "banner.update",        description: "Can update banners"    },
    { name: "banner.create",        description: "Can create banners"    },
    { name: "banner.delete",        description: "Can delete banners"    },

    { name: "order.view",           description: "Can view orders"       },
    { name: "order.update",         description: "Can update orders"     },
    { name: "order.create",         description: "Can create orders"     },
    { name: "order.delete",         description: "Can delete orders"     },

    { name: "product.subscription", description: "Is a subscriber"       },

    { name: "order.purchase",       description: "Can purchase an order" },
    
    { name: "discount.view",        description: "Can view discounts"    },
    { name: "discount.update",      description: "Can update discounts"  },
    { name: "discount.create",      description: "Can create discounts"  },
    { name: "discount.delete",      description: "Can delete discounts"  },
];

const rolePermissions = [
    { roleName: "SuperUser", permissionName: "user.view" },
    { roleName: "SuperUser", permissionName: "user.update" },
    { roleName: "SuperUser", permissionName: "user.create" },
    { roleName: "SuperUser", permissionName: "user.delete" },
    { roleName: "SuperUser", permissionName: "role.view" },
    { roleName: "SuperUser", permissionName: "role.update" },
    { roleName: "SuperUser", permissionName: "role.create" },
    { roleName: "SuperUser", permissionName: "role.delete" },
    { roleName: "SuperUser", permissionName: "permission.view" },
    { roleName: "SuperUser", permissionName: "permission.update" },
    { roleName: "SuperUser", permissionName: "permission.create" },
    { roleName: "SuperUser", permissionName: "permission.delete" },
    { roleName: "SuperUser", permissionName: "tag.view" },
    { roleName: "SuperUser", permissionName: "tag.update" },
    { roleName: "SuperUser", permissionName: "tag.create" },
    { roleName: "SuperUser", permissionName: "tag.delete" },
    { roleName: "SuperUser", permissionName: "product.view" },
    { roleName: "SuperUser", permissionName: "product.update" },
    { roleName: "SuperUser", permissionName: "product.create" },
    { roleName: "SuperUser", permissionName: "product.delete" },
    { roleName: "SuperUser", permissionName: "media.view" },
    { roleName: "SuperUser", permissionName: "media.update" },
    { roleName: "SuperUser", permissionName: "media.create" },
    { roleName: "SuperUser", permissionName: "media.delete" },
    { roleName: "SuperUser", permissionName: "synonym.view" },
    { roleName: "SuperUser", permissionName: "synonym.update" },
    { roleName: "SuperUser", permissionName: "synonym.create" },
    { roleName: "SuperUser", permissionName: "synonym.delete" },
    { roleName: "SuperUser", permissionName: "banner.view" },
    { roleName: "SuperUser", permissionName: "banner.update" },
    { roleName: "SuperUser", permissionName: "banner.create" },
    { roleName: "SuperUser", permissionName: "banner.delete" },
    { roleName: "SuperUser", permissionName: "order.view" },
    { roleName: "SuperUser", permissionName: "order.update" },
    { roleName: "SuperUser", permissionName: "order.create" },
    { roleName: "SuperUser", permissionName: "order.delete" },
    { roleName: "SuperUser", permissionName: "discount.view" },
    { roleName: "SuperUser", permissionName: "discount.update" },
    { roleName: "SuperUser", permissionName: "discount.create" },
    { roleName: "SuperUser", permissionName: "discount.delete" },
    { roleName: "Public", permissionName: "user.create" },
    { roleName: "Public", permissionName: "tag.view" },
    { roleName: "Public", permissionName: "product.view" },
    { roleName: "Public", permissionName: "media.view" },
    { roleName: "Public", permissionName: "synonym.view" },
    { roleName: "Public", permissionName: "banner.view" },
    { roleName: "Customer", permissionName: "user.create" },
    { roleName: "Customer", permissionName: "tag.view" },
    { roleName: "Customer", permissionName: "product.view" },
    { roleName: "Customer", permissionName: "media.view" },
    { roleName: "Customer", permissionName: "synonym.view" },
    { roleName: "Customer", permissionName: "banner.view" },
    { roleName: "Customer", permissionName: "order.view" },
    { roleName: "Customer", permissionName: "order.update" },
    { roleName: "Customer", permissionName: "order.create" },
    { roleName: "Customer", permissionName: "order.delete" },
    { roleName: "Customer", permissionName: "order.purchase" },
    { roleName: "BSP", permissionName: "product.subscription" },
];

export const userRoles = [
    { userName: "admin", roleName: "SuperUser" },
    { userName: "public", roleName: "Public" },
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
        .createTable("users", usersTable)
        .createTable("roles", rolesTable)
        .createTable("permissions", permissionsTable)
        .createTable("rolePermissions", rolePermissionsTable)
        .createTable("userRoles", userRolesTable),
    priority: 0,
    initData: () => Promise.all([
        insertUsers(db, users),
        insertRoles(db, roles),
        insertPermissions(db, permissions),
        insertRolePermissions(db, rolePermissions),
        insertUserRoles(db, userRoles),
    ]),
}
