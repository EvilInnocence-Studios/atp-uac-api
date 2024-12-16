import jwt from "jsonwebtoken";
import { intersection } from "ts-functional";
import { secret } from "../../../config";
import { database } from "../../core/database";
import { error403, getHeader } from "../../core/express/util";
import { User } from "../user/service";

const db = database();

export const CheckPermissions = (...permissions: string[]) => {
    return function (...args:any[]): void {
        const descriptor = args[2];
        const originalMethod = descriptor.value;

        descriptor.value = async function (...funcArgs: any[]) {
            const token = getHeader('authorization')(funcArgs).split(" ")[1];
            if (!token) {
                throw error403;
            }
            console.log(token);

            const userId:number = (jwt.verify(token, secret) as jwt.JwtPayload).userId;
            if(!userId) {
                throw error403;
            }
            console.log(userId);

            // TODO: Cache this call for a limited time
            const userPermissions = await User.permissions.get(userId);
            if(!userPermissions) {
                throw error403;
            }
            console.log(userPermissions);

            // Perform the permission logic
            const hasPermission = intersection(permissions, userPermissions.map(p => p.name)).length > 0;
            if (!hasPermission) {
                throw error403;
            }

            // Call the original method if permission is granted
            return originalMethod(...funcArgs);
        };
    };
}
