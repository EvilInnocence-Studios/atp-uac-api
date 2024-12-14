import { post } from "../../core/lib/express/wrappers";
import { LoginHandlers } from "./handlers";

export const LoginEndpoints = {
    login: {
        POST: post(LoginHandlers.login),
    }
}