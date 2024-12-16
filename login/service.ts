import jwt from "jsonwebtoken";
import { CodedPromise } from "serverless-api-boilerplate";
import { secret } from "../../../config";
import { ILoginResponse } from "../../uac-shared/login/types";
import { User } from "../user/service";

export const Login = {
    login: (userName: string, password:string):Promise<ILoginResponse> => CodedPromise<ILoginResponse>((resolve, reject, fail, error, notFound) => {
        User.loadUnsafeByName(userName).then(async user => {
            if(User.hashPassword(password) === user.passwordHash) {
                const userId = user.id;
                const permissions = await User.permissions.get(user.id);
                resolve({
                    user: User.makeSafe(user),
                    permissions,
                    loginToken: jwt.sign({userId}, secret),
                });
            } else {
                fail("Invalid credentials");
            }
        }).catch(() => {
            fail("Invalid credentials");
        });
    }),
}
