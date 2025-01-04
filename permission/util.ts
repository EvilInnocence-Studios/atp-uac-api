import jwt from "jsonwebtoken";
import { intersection, memoizePromise } from "ts-functional";
import { secret } from "../../../config";
import { database } from "../../core/database";
import { error403, getHeader, getParam } from "../../core/express/util";
import { User } from "../user/service";
import { IPermission } from "../../uac-shared/permissions/types";

const db = database();

export const CheckPermissions = (...permissions: string[]) => {
    return function (...args:any[]): void {
        const descriptor = args[2];
        const originalMethod = descriptor.value;

        descriptor.value = async function (...funcArgs: any[]) {
            let userId:number | null = null;
            // Get the login token from the request headers
            const token = getHeader('authorization')(funcArgs).split(" ")[1];
            if (!token) {
                // If no token is found, load the public user
                const publicUser = await memoizePromise(async () => User.loadByName("public"), {})();
                userId = publicUser.id;
            } else {
                // Get the user id from the login token
                userId = (jwt.verify(token, secret) as jwt.JwtPayload).userId;
            }

            // If no user id is found, throw a 403 error
            if(!userId) {
                throw error403;
            }

            // Get the user permissions from the database
            const getUserPermissions = memoizePromise(User.permissions.get, {ttl: 1000 * 60 * 5});
            const userPermissions = await getUserPermissions(userId);
            if(!userPermissions) {
                throw error403;
            }

            // Check if the user has the required permissions
            const hasPermission = intersection(permissions, userPermissions.map(p => p.name)).length > 0;
            if (!hasPermission) {
                throw error403;
            }

            // Call the original method if permission is granted
            return originalMethod(...funcArgs);
        };
    };
}

export const CheckOwnership = (...args:any[]) => {
    const descriptor = args[2];
    const originalMethod = descriptor.value;

    descriptor.value = function (...funcArgs: any[]) {
        // Get the login token from the request headers
        const token = getHeader('authorization')(funcArgs).split(" ")[1];
        if (!token) {
            throw error403;
        }

        // Get the user id from the login token
        const userId:number = (jwt.verify(token, secret) as jwt.JwtPayload).userId;
        if(!userId) {
            throw error403;
        }
        console.log(userId);

        // Get the user id from the path
        const pathId = getParam("userId")(funcArgs);
        if (pathId !== userId) {
            throw error403;
        }

        return originalMethod(...funcArgs);
    };
}
