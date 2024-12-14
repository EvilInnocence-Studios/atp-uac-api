import { pipeTo } from "serverless-api-boilerplate";
import { HandlerArgs } from "../../core/lib/express/types";
import { getBodyParam } from "../../core/lib/express/util";
import { ILoginRequest, ILoginResponse } from "../../lib/common/api/services/uac/login/types";
import { Login } from "./service";

class LoginHandlerClass {
    public login (...args:HandlerArgs<ILoginRequest>):Promise<ILoginResponse> {
        return pipeTo(Login.login, getBodyParam("userName"), getBodyParam("password"))(args);
    }
}

export const LoginHandlers = new LoginHandlerClass();
