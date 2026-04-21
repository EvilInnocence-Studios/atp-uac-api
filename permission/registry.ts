import { IPermission } from "../../uac-shared/permissions/types";

export type PermissionPlugin = (userPermissions: IPermission[], funcArgs: any[]) => Promise<void>;

const plugins: PermissionPlugin[] = [];

export const registerPermissionPlugin = (plugin: PermissionPlugin) => {
    plugins.push(plugin);
};

export const runPermissionPlugins = async (userPermissions: IPermission[], funcArgs: any[]) => {
    for (const plugin of plugins) {
        await plugin(userPermissions, funcArgs);
    }
};
