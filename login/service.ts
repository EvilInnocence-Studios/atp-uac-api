import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { salt, secret } from "../../../config";
import { database } from "../../core/database";
import { error401 } from "../../core/express/errors";
import { ILoginResponse } from "../../uac-shared/login/types";
import { User } from "../user/service";

export const Login = {
    login: async (userName: string, password:string):Promise<ILoginResponse> => {
        console.log(`Logging in ${userName} with password ${password}`);
        return User.loadUnsafeByNameInsensitive(userName).then(async user => {
            console.log("User", user);
            console.log("Salt", salt);
            console.log("Stored password", user.passwordHash);
            if(await User.verifyPassword(password, user)) {
                console.log("Passwords match");

                // Auto-upgrade legacy hashes
                if (user.hashAlgorithm !== "bcrypt") {
                    console.log(`Upgrading password hash for user ${user.id} to bcrypt`);
                    const passwordHash = await bcrypt.hash(password, 10);
                    await database()("users").update({passwordHash, hashAlgorithm: "bcrypt"}).where({id: user.id});
                }

                const userId = user.id;
                return Login.profile(Promise.resolve(userId));
            } else {
                console.log("Passwords do not match");
                throw error401;
            }
        }).catch((e:any) => {
            console.log(e);
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
                loginToken: jwt.sign({userId: user.id}, secret()),
            };
        })
    },
}
