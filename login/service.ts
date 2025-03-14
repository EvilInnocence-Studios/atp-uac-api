import jwt from "jsonwebtoken";
import { salt, secret } from "../../../config";
import { error401 } from "../../core/express/errors";
import { ILoginResponse } from "../../uac-shared/login/types";
import { User } from "../user/service";

export const Login = {
    login: async (userName: string, password:string):Promise<ILoginResponse> => {
        console.log(`Logging in ${userName} with password ${password}`);
        return User.loadUnsafeByNameInsensitive(userName).then(async user => {
            console.log("User", user);
            console.log("Salt", salt);
            console.log(`Hashed password: ${User.hashPassword(password)}`);
            console.log("Stored password", user.passwordHash);
            if(User.hashPassword(password) === user.passwordHash) {
                console.log("Passwords match");
                const userId = user.id;
                return Login.profile(Promise.resolve(userId));
            } else {
                console.log("Passwords do not match");
                throw error401;
            }
        }).catch(() => {
            console.log("No user found");
            throw error401;
        })
    },
    profile: async (userId:Promise<string>):Promise<ILoginResponse> => {
        return User.loadById(await userId).then(async user => {
            const permissions = await User.permissions.get(user.id);
            return {
                user,
                permissions,
                loginToken: jwt.sign({userId: user.id}, secret),
            };
        })
    },
}
