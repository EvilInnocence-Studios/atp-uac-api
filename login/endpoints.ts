import { get, post } from "../../core/express/wrappers";
import { LoginHandlers } from "./handlers";

export const LoginEndpoints = {
    login: {
        POST: post(LoginHandlers.login),
    },
    profile: {
        GET: get(LoginHandlers.profile),
    }
}