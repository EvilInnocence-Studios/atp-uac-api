import React from 'react';
import { getAppConfig } from '../../../config';
import { IRole } from '../../uac-shared/role/types';

export declare interface IRoleChangeParams {
    role: IRole;
    action: "add" | "remove";
}

export const RoleChange = ({role, action}:IRoleChangeParams) => {
    return <>
        <div>
            <h1>Evilinnocence Studios</h1>
            <p>
                Role Change<br/>
                You have been {action === "add" ? "added to" : "removed from"} the {role.name} role.
            </p>
        </div>
    </>;
}