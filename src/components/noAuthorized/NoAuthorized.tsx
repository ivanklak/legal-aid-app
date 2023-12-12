import React, {useCallback} from "react";
import styles from "./NoAuthorized.module.sass";
import {useNavigate} from "react-router-dom";
import {RiStackFill} from "react-icons/ri";
import Button from "../../controls/button/Button";

const NoAuthorized = () => {
    const navigate = useNavigate();

    const onLoginClick = useCallback(() => {
        navigate('/login')
    }, [navigate])

    return (
        <div className={styles.no_auth_container}>
            <RiStackFill className={styles.icon} size={60} />
            <div className={styles.caption}>Войдите в личный кабинет</div>
            <div className={styles.title}>чтобы увидеть ваши обращения</div>
            <div className={styles.buttons_container}>
                <Button
                    className={styles.login_button}
                    onClick={onLoginClick}
                >
                    Войти
                </Button>
            </div>
        </div>
    )
}

export default NoAuthorized;
