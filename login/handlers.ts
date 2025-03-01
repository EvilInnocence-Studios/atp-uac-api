import { pipeTo } from "serverless-api-boilerplate";
import { HandlerArgs } from "../../core/express/types";
import { getBodyParam, getLoggedInUser } from "../../core/express/extractors";
import { ILoginRequest, ILoginResponse } from "../../uac-shared/login/types";
import { Login } from "./service";

class LoginHandlerClass {
    public login (...args:HandlerArgs<ILoginRequest>):Promise<ILoginResponse> {
        return pipeTo(Login.login, getBodyParam("userName"), getBodyParam("password"))(args);
    }

    public profile (...args:HandlerArgs<void>):Promise<ILoginResponse> {
        return pipeTo(Login.profile, getLoggedInUser)(args);
    }
}

export const LoginHandlers = new LoginHandlerClass();
