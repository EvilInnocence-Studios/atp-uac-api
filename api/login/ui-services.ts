import { useLocalStorage } from "unstateless";
import { IMethods } from "../../../types";
import { getResults } from "../../../util";
import {ILoginRequest, ILoginResponse} from "./types";
import { notification } from "antd";

const emptyUser = {userName: '', id: 0, mustUpdatePassword: false};
const emptyLoggedInUser = {user: emptyUser, loginToken: ''};

export const useLoggedInUser = useLocalStorage.object<ILoginResponse>('loggedInUser', emptyLoggedInUser);
export const isLoggedIn = () => !!useLoggedInUser.getValue() && !!useLoggedInUser.getValue().loginToken;
export const getLoginToken = () => useLoggedInUser.getValue().loginToken;
export const getCurrentUser = () => useLoggedInUser.getValue().user;

export const loginServices = ({post}:IMethods) => ({
    login: (req:ILoginRequest) => post('login', req)
        .then(getResults<ILoginResponse>)
        .then(({user, loginToken}) => {
            useLoggedInUser.setValue({user, loginToken});
            notification.success({message: 'Login Successful'});
        }).catch(err => {
            notification.error({message: 'Login Failed', description: err.message});
        }),

    logout: () => useLoggedInUser.setValue(emptyLoggedInUser)
});
