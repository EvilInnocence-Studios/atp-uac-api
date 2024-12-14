import { del, get, patch, post } from "../../core/express/wrappers";
import { RoleHandlers } from "./handlers";

export const RoleEndpoints = {
    role: {
        GET: get(RoleHandlers.search),
        POST: post(RoleHandlers.create),
        ":roleId": {
            GET: get(RoleHandlers.get),
            PATCH: patch(RoleHandlers.update),
            DELETE: del(RoleHandlers.remove),
            permission: {
                GET: get(RoleHandlers.getPermissions),
                POST: post(RoleHandlers.addPermission),
                ":permissionId": {
                    DELETE: del(RoleHandlers.removePermission),
                }
            }
        }   
    }
};
