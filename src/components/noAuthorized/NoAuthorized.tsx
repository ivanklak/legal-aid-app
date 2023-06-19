import React, {useCallback} from "react";
import styles from "./NoAuthorized.module.sass";
import {Button} from "antd";
import {useNavigate} from "react-router-dom";
import {RiStackFill} from "react-icons/ri";

const NoAuthorized = () => {
    const navigate = useNavigate();

    const onLoginClick = useCallback(() => {
        navigate('/login')
    }, [navigate])

    return (
        <div className={styles.no_auth_container}>
            <RiStackFill className={styles.icon} size={60} color={'var(--base-color__grey200)'} />
            <div className={styles.caption}>Войдите в личный кабинет</div>
            <div className={styles.title}>чтобы увидеть ваши обращения</div>
            <div className={styles.buttons_container}>
                <Button type="primary" onClick={onLoginClick}>Войти</Button>
            </div>
        </div>
    )
}

export default NoAuthorized;
