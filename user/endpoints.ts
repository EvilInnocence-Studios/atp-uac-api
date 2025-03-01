import { del, get, patch, post } from "../../core/express/wrappers";
import { UserHandlers } from "./handlers";

export const UserEndpoints = {
    user: {
        GET: get(UserHandlers.search),
        POST: post(UserHandlers.create),
        passwordResetToken: {
            GET: get(UserHandlers.createPasswordResetToken),
        },
        forgotPassword: {
            POST: post(UserHandlers.forgotPassword),
        },
        resetPassword: {
            POST: post(UserHandlers.resetPassword),
        },
        forgotUserName: {
            POST: post(UserHandlers.forgotUserName),
        },
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
            },
            wishlist: {
                GET: get(UserHandlers.getWishlists),
                POST: post(UserHandlers.addToWishlist),
                ":productId": {
                    DELETE: del(UserHandlers.removeFromWishlist),
                }
            },
            subscription: {
                POST: post(UserHandlers.subscribe),
                DELETE: del(UserHandlers.unsubscribe),
            }
        }
    },
}