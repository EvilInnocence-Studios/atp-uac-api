import React from 'react';
import { getAppConfig } from '../../../config';

export declare interface IForgotLoginParams {
    email: string;
    userName: string;
    token: string;
}

export const ForgotLogin = ({email, userName, token}:IForgotLoginParams) => {
    const url = `${getAppConfig().publicHost}/reset-password?token=${token}`;

    return <>
        <div>
            <h1>Evilinnocence Studios</h1>
            <p>
                Username for {email}:<br/>
                <b>{userName}</b>
            </p>
            <p>
                Password reset link for {userName}<br/>
                Click <a href={url}>here</a> to reset your password, or go the the URL below:<br/><br/>

                {url}
            </p>
            
        </div>
    </>;
}