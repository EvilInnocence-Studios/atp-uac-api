import { Knex } from "knex";
import { database } from "../../core/database";

const db = database();

export const usersTable = (t:Knex.CreateTableBuilder) => {
    t.bigIncrements();
    t.string("userName",       255).notNullable().unique();
    t.string("email",          255).notNullable().unique();
    t.string("prefix"             ).notNullable().defaultTo("");
    t.string("firstName"          ).notNullable().defaultTo("");
    t.string("lastName"           ).notNullable().defaultTo("");
    t.string("suffix"             ).notNullable().defaultTo("");
    t.string("subscriptionId", 255).unique();
    t.string("passwordHash",    64).notNullable();
    t.boolean("mustUpdatePassword").notNullable();
    t.dateTime("createdAt"        ).notNullable().defaultTo(db.fn.now());
};

export const rolesTable = (t:Knex.CreateTableBuilder) => {
    t.bigIncrements();
    t.string("name",         64).notNullable().unique();
    t.string("description", 255);
};

export const permissionsTable = (t:Knex.CreateTableBuilder) => {
    t.bigIncrements();
    t.string("name",         64).notNullable().unique();
    t.string("description", 255);
}

export const rolePermissionsTable = (t:Knex.CreateTableBuilder) => {
    t.bigInteger("roleId"      ).unsigned().notNullable().references("id").inTable("roles"      ).onDelete("CASCADE");
    t.bigInteger("permissionId").unsigned().notNullable().references("id").inTable("permissions").onDelete("CASCADE");
    t.unique(["roleId", "permissionId"]);
}

export const userRolesTable = (t:Knex.CreateTableBuilder) => {
    t.bigInteger("roleId").unsigned().notNullable().references("id").inTable("roles").onDelete("CASCADE");
    t.bigInteger("userId").unsigned().notNullable().references("id").inTable("users").onDelete("CASCADE");
    t.unique(["roleId", "userId"]);
}
