import { createInjector, inject, mergeProps } from "unstateless";
import { useLoggedInUser } from "../../../lib/common/api/services/uac/login/services";
import { LoggedInComponent } from "./LoggedIn.component";
import { ILoggedInInputProps, ILoggedInProps, LoggedInProps } from "./LoggedIn.d";

const injectLoggedInProps = createInjector(({yes, no}:ILoggedInInputProps):ILoggedInProps => {
    const [loggedInUser] = useLoggedInUser();
    const loggedIn = !!loggedInUser && !!loggedInUser.loginToken;

    return yes && loggedIn || no && !loggedIn
    ? {show: true}
    : {show: false};
});

const connect = inject<ILoggedInInputProps, LoggedInProps>(mergeProps(
    injectLoggedInProps,
));

export const LoggedIn = connect(LoggedInComponent);
