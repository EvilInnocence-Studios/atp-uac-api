import { LoggedInProps } from "./LoggedIn.d";

export const LoggedInComponent = ({show, children}:LoggedInProps) => show
    ? children
    : null;
