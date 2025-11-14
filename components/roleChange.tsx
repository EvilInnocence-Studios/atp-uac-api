import { Setting } from '../../common/setting/service';
import React from 'react';
import { IRole } from '../../uac-shared/role/types';

export declare interface IRoleChangeParams {
    role: IRole;
    action: "add" | "remove";
}

export const RoleChange = async ({role, action}:IRoleChangeParams) => {
    const siteName = await Setting.get("siteName");

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