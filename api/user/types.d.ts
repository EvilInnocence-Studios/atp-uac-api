export declare interface IUser {
    id: number;
    userName: string;
    passwordHash: string;
    mustUpdatePassword: boolean;
}

export type SafeUser = Omit<IUser, 'passwordHash'>;

export type NewUser = Omit<IUser, 'id'>;