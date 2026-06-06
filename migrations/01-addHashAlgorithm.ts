import { database } from "../../core/database";
import { IMigration } from "../../core/dbMigrations";

const db = database();

export const addHashAlgorithm:IMigration = {
    name: "addHashAlgorithm",
    module: "uac",
    description: "Adds the hashAlgorithm column to the users table",
    version: "1.0.0",
    order: 1,
    up: () => db.schema.alterTable("users", (table) => {
        table.string("hashAlgorithm").defaultTo("sha-256").notNullable();
    }),
    down: () => db.schema.alterTable("users", (table) => {
        table.dropColumn("hashAlgorithm");
    }),
    initData: () => Promise.resolve(),
}