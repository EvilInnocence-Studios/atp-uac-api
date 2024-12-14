import { database } from "../../core/database";
import { getHeader } from "../../core/express/util";

const db = database();

export const CheckPermissions = (...permissions: string[]) => {
    return function (...args:any[]): void {
        const descriptor = args[2];
        const originalMethod = descriptor.value;

        descriptor.value = function (...funcArgs: any[]) {
            const token = getHeader('login-token')(funcArgs);

            // Perform the permission logic
            const hasPermission = true; // Replace with real logic
            if (!hasPermission) {
                throw new Error("Permission denied");
            }

            // Call the original method if permission is granted
            return originalMethod(...funcArgs);
        };
    };
}
