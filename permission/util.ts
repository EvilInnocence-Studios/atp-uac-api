import jwt from "jsonwebtoken";
import { intersection } from "ts-functional";
import { secret } from "../../../config";
import { database } from "../../core/database";
import { error403 } from "../../core/express/errors";
import { getHeader, getLoggedInUser, getParam, getUserPermissions } from "../../core/express/extractors";
import { Product } from "../../store/product/service";
import { IPermission } from "../../uac-shared/permissions/types";

const db = database();

export const hasPermission = (permissions:string[], userPermissions:IPermission[]) =>
    intersection(permissions, userPermissions.map(p => p.name)).length > 0;

export const CheckPermissions = (...permissions: string[]) => {
    return function (...args:any[]): void {
        const descriptor = args[2];
        const originalMethod = descriptor.value;

        descriptor.value = async function (...funcArgs: any[]) {
            let userId = await getLoggedInUser(funcArgs);

            // If no user id is found, throw a 403 error
            if(!userId) {
                throw error403;
            }

            // Get the user permissions from the database
            const userPermissions = await getUserPermissions(funcArgs);
            if(!userPermissions) {
                console.log("No user permissions found");
                throw error403;
            }

            // Check if the user has the required permissions
            if (!hasPermission(permissions, userPermissions)) {
                console.log(`User does not have permission ${permissions}`);
                throw error403;
            }

            // If this is a user specific endpoint, make sure the user has the same userId
            // However, if the user has the "user.admin" permission, they can access any user
            const pathId = getParam("userId")(funcArgs);
            const isUserAdmin = userPermissions.find(p => p.name === "user.admin");
            const idsMatch = `${pathId}` === `${userId}`;
            if (pathId && !isUserAdmin && !idsMatch) {
                console.log(`User does not have permission to access userId ${pathId}`);
                throw error403;
            }

            // If this is a product specific endpoint and the product is not enabled, make sure that the user can view disabled products
            const productId = getParam<string>("productId")(funcArgs);
            const canViewDisabledProducts = userPermissions.find(p => p.name === "product.disabled");
            if (productId && !canViewDisabledProducts) {
                const product = await Product.loadById(productId);
                if (!product || !product.enabled) {
                    console.log(`User does not have permission to access disabled product ${productId}`);
                    throw error403;
                }
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
        const userId:number = (jwt.verify(token, secret()) as jwt.JwtPayload).userId;
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
