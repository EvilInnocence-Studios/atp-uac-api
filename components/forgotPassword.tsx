import React from 'react';
import { getAppConfig } from '../../../config';

export declare interface IForgotPasswordParams {
    userName: string;
    token: string;
}

export const ForgotPassword = ({userName, token}:IForgotPasswordParams) => {
    const url = `${getAppConfig().publicHost}/reset-password?token=${token}`;

    return <>
        <div>
            <h1>Evilinnocence Studios</h1>
            <p>
                Forgot Password for {userName}<br/>
                Click <a href={url}>here</a> to reset your password, or go the the URL below:<br/><br/>

                {url}
            </p>
            
        </div>
    </>;
}