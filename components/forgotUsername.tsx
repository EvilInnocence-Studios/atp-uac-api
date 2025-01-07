import React from 'react';
import { getAppConfig } from '../../../config';

export declare interface IForgotUsernameParams {
    email: string;
    userName: string;
}

export const ForgotUsername = ({email, userName}:IForgotUsernameParams) => {
    return (
        <div>
            <h1>Username for {email}: <b>{userName}</b></h1>
        </div>
    );
}