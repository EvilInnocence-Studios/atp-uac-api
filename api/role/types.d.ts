export declare interface IRole {
    id: number;
    name: string;
    description: string;
}

export declare type NewRole = Omit<IRole, "id">;

