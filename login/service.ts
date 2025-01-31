import jwt from "jsonwebtoken";
import { secret } from "../../../config";
import { error401 } from "../../core/express/util";
import { ILoginResponse } from "../../uac-shared/login/types";
import { User } from "../user/service";

export const Login = {
    login: async (userName: string, password:string):Promise<ILoginResponse> => 
        User.loadUnsafeByName(userName).then(async user => {
            if(User.hashPassword(password) === user.passwordHash) {
                const userId = user.id;
                const permissions = await User.permissions.get(user.id);
                return {
                    user: User.makeSafe(user),
                    permissions,
                    loginToken: jwt.sign({userId}, secret),
                };
            } else {
                throw error401;
            }
        }).catch(() => {
            throw error401;
        }),
}
