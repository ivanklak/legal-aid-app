import React, {FC, useCallback, useContext, useState} from "react";
import styles from "./RightSideBar.module.css";
import {INotifications} from "../mainPage/MainPage";
import {useNavigate} from "react-router-dom";
import {BsPlusSquareDotted} from "react-icons/bs";
import AuthContext from "../../App/Layers/AuthProvider";
import {Button, notification} from "antd";

interface RightSideBarProps {
    notifications: Array<INotifications>
}

const RightSideBar: FC<RightSideBarProps> = ({notifications}) => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [api, contextHolder] = notification.useNotification();

    const onListClick = () => {
        navigate('/category')
    }

    const openLoginNotification = () => {
        const key = `open${Date.now()}`;
        const onLoginClick = () => {
            api.destroy(key)
            navigate('/login')
        }
        const btn = (
            <Button type="default" size="middle" onClick={onLoginClick}>
                Войти
            </Button>
        );
        api['info']({
            message: 'Вход',
            description: 'Чтобы создать обращение нужно войти в личный кабинет',
            btn,
            key,
            onClose: onLoginNotificationClose,
        });
    }

    const onLoginNotificationClose = () => {
        console.log('close')
    }

    const onCreateClick = useCallback(() => {
        if (auth) {
            navigate('/newRequest')
        } else {
            openLoginNotification();
        }
    }, [openLoginNotification, auth, navigate])

    return (
        <div className={styles.right_side_bar}>
            <div className={styles.create_new}>
                {contextHolder}
                <div className={styles.button_container} onClick={onCreateClick}>
                    <div className={styles.create_button}>
                        <div className={styles.create_icon}>
                            <BsPlusSquareDotted size="25" color="var(--base-color__white)" />
                        </div>
                    </div>
                </div>
                <div className={styles.create_text}>
                    <div className={styles.create_caption}>Новое обращение</div>
                    <div className={styles.create_notice}>или выберете категорию и учреждение из <span className={styles.list} onClick={onListClick}>списка</span></div>
                </div>
            </div>
        </div>
    )
}

export default RightSideBar;