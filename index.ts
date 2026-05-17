import { FieldRegistry } from "@core/express/util";
import { init } from "../uac/migrations/00-init";

export { apiConfig } from "./endpoints";

export const migrations = [init];
export const setupMigrations = [init];

FieldRegistry.register("users", ["userName", "email", "firstName", "lastName", "prefix", "suffix"]);
FieldRegistry.register("roles", ["name", "description"]);
FieldRegistry.register("permissions", ["name", "description"]);
FieldRegistry.register("rolePermissions", []);
FieldRegistry.register("userRoles", []);