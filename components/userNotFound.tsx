import React from 'react';
import { Setting } from '../../common/setting/service';

export declare interface IForgotLoginParams {
    email: string;
}

export const UserNotFound = async ({email}:IForgotLoginParams) => {
    const siteName = await Setting.get("siteName");

    return <>
        <div>
            <h1>{siteName}</h1>
            <p>
                You requested a username reminder and/or password reset for <b>{email}</b>, but that user was not found in our system.<br/>
            </p>
        </div>
    </>;
}