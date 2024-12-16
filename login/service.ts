import jwt from "jsonwebtoken";
import { CodedPromise } from "serverless-api-boilerplate";
import { secret } from "../../../config";
import { User } from "../user/service";
import { ILoginResponse } from "../../uac-shared/login/types";

export const Login = {
    login: (userName: string, password:string):Promise<ILoginResponse> => CodedPromise<ILoginResponse>((resolve, reject, fail, error, notFound) => {
        User.loadUnsafeByName(userName).then(user => {
            if(User.hashPassword(password) === user.passwordHash) {
                resolve({
                    user: User.makeSafe(user),
                    loginToken: jwt.sign({userId: user.id}, secret),
                });
            } else {
                fail("Invalid credentials");
            }
        }).catch(() => {
            fail("Invalid credentials");
        });
    }),
}
