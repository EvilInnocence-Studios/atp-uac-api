import { del, get, patch, post } from "../../core/express/wrappers";
import { UserHandlers } from "./handlers";

export const UserEndpoints = {
    user: {
        GET: get(UserHandlers.search),
        POST: post(UserHandlers.create),
        passwordResetToken: {
            GET: get(UserHandlers.createPasswordResetToken),
        },
        resetPassword: {
            POST: post(UserHandlers.resetPassword),
        },
        forgotLogin: {
            POST: post(UserHandlers.forgotLogin),
        },
        ":userId": {
            GET: get(UserHandlers.get),
            PATCH: patch(UserHandlers.update),
            DELETE: del(UserHandlers.remove),
            resetPassword: {
                POST: post(UserHandlers.resetPasswordByUser),
            },
            role: {
                GET: get(UserHandlers.getRoles),
                POST: post(UserHandlers.addRole),
                ":roleId": {
                    DELETE: del(UserHandlers.removeRole),
                }
            },
            permission: {
                GET: get(UserHandlers.getPermissions),
            },
        }
    },
}