import React from 'react';
import { getAppConfig } from '../../../config';

export declare interface IForgotLoginParams {
    email: string;
}

export const UserNotFound = ({email}:IForgotLoginParams) => {
    return <>
        <div>
            <h1>Evilinnocence Studios</h1>
            <p>
                You requested a username reminder and/or password reset for <b>{email}</b>, but that user was not found in our system.<br/>
            </p>
        </div>
    </>;
}