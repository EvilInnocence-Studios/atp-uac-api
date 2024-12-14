export declare interface IPermission {
    id: number;
    name: string;
    description: string;
}

export declare type NewPermission = Omit<IPermission, "id">;
