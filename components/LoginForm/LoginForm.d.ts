export declare interface ILoginFormProps {
    userName: string;
    password: string;
    setUserName: (userName: string) => void;
    setPassword: (password: string) => void;
    login: () => void;
}

// What gets passed into the component from the parent as attributes
export declare interface ILoginFormInputProps {
    appName?: string;
}

export type LoginFormProps = ILoginFormInputProps & ILoginFormProps;