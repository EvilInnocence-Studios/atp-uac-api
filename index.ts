import { init } from "../uac/migrations/00-init";

export { apiConfig } from "./endpoints";

export const migrations = [init];
export const setupMigrations = [init];