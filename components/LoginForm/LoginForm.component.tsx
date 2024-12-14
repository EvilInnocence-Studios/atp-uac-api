import { Button, Input } from "antd";
import { LoginFormProps } from "./LoginForm.d";
import styles from './LoginForm.module.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faSignIn, faUser } from "@fortawesome/free-solid-svg-icons";
import {onInputChange} from "../../../lib/common/onInputChange";

export const LoginFormComponent = ({appName, userName, setUserName, password, setPassword, login}:LoginFormProps) =>
    <div className={styles.loginForm}>
        <div className={styles.header}>
            {appName} Login
        </div>
        <div className={styles.form}>
            <Input addonBefore={<FontAwesomeIcon icon={faUser} />} value = {userName} placeholder="Username" onChange={onInputChange(setUserName)}/>
            <Input.Password addonBefore={<FontAwesomeIcon icon={faLock} />} value={password} placeholder="Password" onChange={onInputChange(setPassword)}/>
        </div>
        <div className={styles.footer}>
            <Button type="primary" onClick={login}>
                <FontAwesomeIcon icon={faSignIn} /> Login
            </Button>
        </div>
    </div>;
