import React from 'react';
import { Setting } from '../../common/setting/service';
import { IUser } from "../../uac-shared/user/types";

export declare interface INewAccountParams {
    user: IUser;
    siteName: string;
};

export const NewAccount = ({user, siteName}:INewAccountParams) => {
    return <>
        <div>
            <h1>{siteName}</h1>
            <p>
                Account Created<br/>
                Welcome to {siteName}, {user.userName}!
            </p>
        </div>
    </>;
}