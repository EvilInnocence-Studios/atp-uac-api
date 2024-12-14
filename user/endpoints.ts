import { del, get, patch, post } from "../../core/express/wrappers";
import { UserHandlers } from "./handlers";

export const UserEndpoints = {
    user: {
        GET: get(UserHandlers.search),
        POST: post(UserHandlers.create),
        ":userId": {
            GET: get(UserHandlers.get),
            PATCH: patch(UserHandlers.update),
            DELETE: del(UserHandlers.remove),
            role: {
                GET: get(UserHandlers.getRoles),
                POST: post(UserHandlers.addRole),
                ":roleId": {
                    DELETE: del(UserHandlers.removeRole),
                }
            },
            permission: {
                GET: get(UserHandlers.getPermissions),
            }
        }
    },
}