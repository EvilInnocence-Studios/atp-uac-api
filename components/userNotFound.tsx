import React from 'react';
import { Setting } from '../../common/setting/service';

export declare interface IForgotLoginParams {
    email: string;
    siteName: string;
}

export const UserNotFound = ({email, siteName}:IForgotLoginParams) => {
    return <>
        <div>
            <h1>{siteName}</h1>
            <p>
                You requested a username reminder and/or password reset for <b>{email}</b>, but that user was not found in our system.<br/>
            </p>
        </div>
    </>;
}