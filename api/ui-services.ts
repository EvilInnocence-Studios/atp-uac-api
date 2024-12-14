import { IMethods } from "../../types";
import { loginServices } from "./login/services";
import { permissionServices } from "./permission/services";
import { roleServices } from "./role/services";
import { userServices } from "./user/services";

export const uacServices = (methods:IMethods) => ({
    ...userServices(methods),
    ...roleServices(methods),
    ...permissionServices(methods),
    ...loginServices(methods),
});