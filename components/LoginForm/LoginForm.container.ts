import { createInjector, inject, mergeProps } from "unstateless";
import {LoginFormComponent} from "./LoginForm.component";
import {ILoginFormInputProps, LoginFormProps, ILoginFormProps} from "./LoginForm.d";
import { useState } from "react";
import { services } from "../../../lib/api";

const injectLoginFormProps = createInjector(({}:ILoginFormInputProps):ILoginFormProps => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    const login = () => {
        services.login({userName, password});
    }

    return {userName, setUserName, password, setPassword, login};
});

const connect = inject<ILoginFormInputProps, LoginFormProps>(mergeProps(
    injectLoginFormProps,
));

export const LoginForm = connect(LoginFormComponent);
