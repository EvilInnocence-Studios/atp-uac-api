import { Setting } from '../../common/setting/service';
import React from 'react';
import { IRole } from '../../uac-shared/role/types';

export declare interface IRoleChangeParams {
    role: IRole;
    action: "add" | "remove";
    siteName: string;
}

export const RoleChange = ({role, action, siteName}:IRoleChangeParams) => {
    return <>
        <div>
            <h1>{siteName}</h1>
            <p>
                Role Change<br/>
                You have been {action === "add" ? "added to" : "removed from"} the {role.name} role.
            </p>
        </div>
    </>;
}