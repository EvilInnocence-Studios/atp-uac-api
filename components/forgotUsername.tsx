import React from 'react';
import { getAppConfig } from '../../../config';

export declare interface IForgotUsernameParams {
    email: string;
    userName: string;
}

export const ForgotUsername = ({email, userName}:IForgotUsernameParams) => {
    return <>
        <div>
            <h1>EvilInnocence Studios</h1>
            <p>
                Username for {email}:<br/>
                <b>{userName}</b>
            </p>
        </div>
    </>;
}