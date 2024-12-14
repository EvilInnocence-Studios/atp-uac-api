import { SafeUser } from "../user/types.d";

export declare interface ILoginRequest {
    userName: string;
    password: string;
}

export declare interface ILoginResponse {
    user: SafeUser;
    loginToken: string;
}
