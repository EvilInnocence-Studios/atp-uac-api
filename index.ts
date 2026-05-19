import { error403 } from "@core/express/errors";
import { getParam } from "@core/express/extractors";
import { FieldRegistry } from "@core/express/util";
import { IPermission } from "@uac-shared/permissions/types";
import { init } from "../uac/migrations/00-init";
import { addHashAlgorithm } from "./migrations/01-addHashAlgorithm";
import { registerPermissionPlugin } from "./permission/registry";

export { apiConfig } from "./endpoints";

export const migrations = [init, addHashAlgorithm];
export const setupMigrations = [init];

FieldRegistry.register("users", {
    create: ["userName", "email", "firstName", "lastName", "prefix", "suffix", "password"],
    update: ["userName", "email", "firstName", "lastName", "prefix", "suffix", "password"],
});
FieldRegistry.register("roles", {
    create: ["name", "description"],
    update: ["name", "description"],
});
FieldRegistry.register("permissions", {
    create: ["name", "description"],
    update: ["name", "description"],
});
FieldRegistry.register("rolePermissions", {
    create: ["roleId", "permissionId"],
    update: [],
});
FieldRegistry.register("userRoles", {
    create: ["roleId", "userId"],
    update: [],
});

// If this is a user specific endpoint, make sure the user has the same userId
// However, if the user has the "user.admin" permission, they can access any user
registerPermissionPlugin((userPermissions: IPermission[], funcArgs: any[], userId: string): Promise<void> => {
    const pathId = getParam("userId")(funcArgs);
    const isUserAdmin = userPermissions.find(p => p.name === "user.admin");
    const idsMatch = `${pathId}` === `${userId}`;
    if (pathId && !isUserAdmin && !idsMatch) {
        console.log(`User does not have permission to access userId ${pathId}`);
        throw error403;
    }

    return Promise.resolve();
});