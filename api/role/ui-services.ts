import { IMethods, Query } from "../../../types";

export const roleServices = ({get, post, put, patch, remove}:IMethods) => ({
    role: {
        create: (roleName: string) => post('role', { roleName }),
        search: (query: Query) => get('role', query),
    }
});