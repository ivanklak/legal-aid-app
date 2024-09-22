import React, {FC, useCallback, useContext} from "react";
import styles from "./RightSideBar.module.sass";
import {INotifications} from "../mainPage/MainPage";
import {useNavigate} from "react-router-dom";
import { BsPlusSquare } from "react-icons/bs";
import AuthContext from "../../App/Layers/AuthProvider";
import {Button, notification} from "antd";

interface RightSideBarProps {
    notifications: Array<INotifications>
}

const RightSideBar: FC<RightSideBarProps> = ({notifications}) => {
    const navigate = useNavigate();
    const { isAuth } = useContext(AuthContext);
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
        if (isAuth) {
            navigate('/mySpace/newRequest')
        } else {
            openLoginNotification();
        }
    }, [openLoginNotification, isAuth, navigate])

    return (
        <div className={styles['right-side-bar']}>
            <div className={styles['create-new']}>
                {contextHolder}
                <div className={styles['button-container']} onClick={onCreateClick}>
                    <BsPlusSquare className={styles['plus-icon']} size="25" />
                </div>
                <div className={styles['create-text']}>
                    <div className={styles['create-caption']}>Новое обращение</div>
                    <div className={styles['create-notice']}>или выберете категорию и учреждение из <span className={styles['list']} onClick={onListClick}>списка</span></div>
                </div>
            </div>
        </div>
    )
}

export default RightSideBar;