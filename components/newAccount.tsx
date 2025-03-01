import React from 'react';
import {IUser} from "../../uac-shared/user/types";

export declare interface INewAccountParams {
    user: IUser;
};

export const NewAccount = ({user}:INewAccountParams) => {
    return <>
        <div>
            <h1>Evilinnocence Studios</h1>
            <p>
                Account Created<br/>
                Welcome to Evilinnocence Studios, {user.userName}!
            </p>
        </div>
    </>;
}