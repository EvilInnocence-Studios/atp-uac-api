export declare interface ILoggedInProps {
    show: boolean;
}

// What gets passed into the component from the parent as attributes
export declare interface ILoggedInInputPropsBase {
    children: React.ReactNode;
}

export declare type ILoggedInInputProps = 
      (ILoggedInInputPropsBase & { yes: boolean; no?: never }) 
    | (ILoggedInInputPropsBase & { no: boolean; yes?: never });


export type LoggedInProps = ILoggedInInputProps & ILoggedInProps;