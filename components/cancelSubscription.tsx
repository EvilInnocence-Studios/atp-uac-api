import React from 'react';
import {SafeUser} from '../../uac-shared/user/types';

export declare interface ICancelSubscriptionProps {
    user: SafeUser;
}

export const CancelSubscription = ({user}:ICancelSubscriptionProps) => <>
    <div>
        <h1>Cancel Subscription</h1>
        <p>{user.userName} has cancelled their subscription, but does not have a subscriptionId.</p>
        <p>Please cancel their subscription in <a href="https://www.paypal.com/billing/plans">PayPal</a> manually.</p>
    </div>
</>;