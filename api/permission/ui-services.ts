import { IMethods, Query } from "../../../types";

export const permissionServices = ({get, post, put, patch, remove}:IMethods) => ({
    permission: {
        create: (name: string) => post('permission', { name }),
        search: (query: Query) => get('permission', query),
    }
});