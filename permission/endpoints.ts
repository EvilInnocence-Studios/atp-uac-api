import { del, get, patch, post } from "../../core/express/wrappers";
import { PermissionHandlers } from "./handlers";

export const PermissionEndpoints = {
    permission: {
        GET: get(PermissionHandlers.search),
        POST: post(PermissionHandlers.create),
        ":permissionId": {
            GET: get(PermissionHandlers.get),
            PATCH: patch(PermissionHandlers.update),
            DELETE: del(PermissionHandlers.remove), 
        },
    },
}
