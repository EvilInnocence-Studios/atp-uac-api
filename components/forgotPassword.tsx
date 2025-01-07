import React from 'react';
import { getAppConfig } from '../../../config';

export declare interface IForgotPasswordParams {
    userName: string;
    token: string;
}

export const ForgotPassword = ({userName, token}:IForgotPasswordParams) => {
    return (
        <div>
            <h1>Forgot Password for {userName}</h1>
            <a href={`${getAppConfig().publicHost}/reset-password?token=${token}`}>Reset Password</a>
        </div>
    );
}