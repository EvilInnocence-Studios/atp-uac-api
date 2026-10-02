import { IPermission } from "../../uac-shared/permissions/types";

export type PermissionPlugin = (
    userPermissions: IPermission[], funcArgs: any[], userId: string, permissions?: string[]
) => Promise<void>;

const plugins: PermissionPlugin[] = [];

export const registerPermissionPlugin = (plugin: PermissionPlugin) => {
    plugins.push(plugin);
};

export const runPermissionPlugins = async (
    userPermissions: IPermission[], funcArgs: any[], userId: string, permissions?: string[]
) => {
    for (const plugin of plugins) {
        await plugin(userPermissions, funcArgs, userId, permissions);
    }
};
