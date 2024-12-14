import { IMethods, Query } from "../../../types.d";
import { getResults } from "../../../util";
import { NewUser, SafeUser } from "./types";

export const userServices = ({get, post, put, patch, remove}:IMethods) => ({
    user: {
        create: (user:NewUser):Promise<SafeUser> => post('user', user)
            .then(getResults<SafeUser>),
        search: (query: Query):Promise<SafeUser[]> => get('user', query)
            .then(getResults<SafeUser[]>),
    }
});
