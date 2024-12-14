import sha256 from 'crypto-js/sha256';
import jwt from "jsonwebtoken";
import { omit } from "ts-functional";
import { salt, secret } from '../../../config';
import { basicCrudService, basicRelationService, twoWayRelationService } from '../../core/express/service/common';
import { loadBy, loadById } from '../../core/express/util';
import { IPermission } from '../../uac-shared/permissions/types';
import { IRole } from '../../uac-shared/role/types';
import { IUser, SafeUser } from '../../uac-shared/user/types';

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
