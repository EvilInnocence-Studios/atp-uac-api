import React from 'react';
import { getAppConfig } from '../../../config';
import { Setting } from '../../common/setting/service';

export declare interface IForgotLoginParams {
    email: string;
    userName: string;
    token: string;
    siteName: string;
}

export const ForgotLogin = ({email, userName, token, siteName}:IForgotLoginParams) => {
    const url = `${getAppConfig().publicHost}/reset-password?token=${token}`;

    return <>
        <div>
            <h1>{siteName}</h1>
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