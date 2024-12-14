import sha256 from 'crypto-js/sha256';
import jwt from "jsonwebtoken";
import { omit } from "ts-functional";
import { IUser, SafeUser } from '../../lib/common/api/services/uac/user/types';
import { basicCrudService, basicRelationService, twoWayRelationService } from '../../core/lib/express/service/common';
import { loadBy, loadById } from '../../core/lib/express/util';
import { IRole } from '../../lib/common/api/services/uac/role/types';
import { IPermission } from '../../lib/common/api/services/uac/permission/types';
import { salt, secret } from '../../config';

const makeSafe = (user:IUser):SafeUser => omit<IUser, "passwordHash">("passwordHash")(user) as SafeUser;

export const User = {
    ...basicCrudService<IUser, SafeUser>("users", "userName", makeSafe),
    loadUnsafe:       loadById<IUser>("users"),
    loadUnsafeByName: loadBy<IUser>("userName", "users"),

    roles: basicRelationService<IRole>("userRoles", "userId", "roles", "roleId"),
    permissions: twoWayRelationService<IPermission>("userId", "roleId", "permissionId", "userRoles", "rolePermissions", "permissions"),

    getLoggedInUser: (token:string):number | null => {
        console.log(token);
        if(!token) return null;
        const userId = parseInt(jwt.verify(token, secret) as string, 10);
        return userId;
    },

    makeSafe: (user:IUser):SafeUser => omit<IUser, "passwordHash">("passwordHash")(user) as SafeUser,
    hashPassword: (str:string) => sha256(salt + str).toString(),
};
