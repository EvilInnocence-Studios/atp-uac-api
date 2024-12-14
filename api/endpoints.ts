import { IApiConfig } from "../endpoints";
import { LoginEndpoints } from "./login/endpoints";
import { PermissionEndpoints } from "./permission/endpoints";
import { RoleEndpoints } from "./role/endpoints";
import { UserEndpoints } from "./user/endpoints";

export const apiConfig:IApiConfig = {
    ...UserEndpoints,
    ...PermissionEndpoints,
    ...RoleEndpoints,
    ...LoginEndpoints,
}