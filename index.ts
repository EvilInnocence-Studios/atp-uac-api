import { setupMigrations as uacSetup } from "./migrations";

export {apiConfig} from "./endpoints";

export const migrations = [];
export const setupMigrations = uacSetup;
