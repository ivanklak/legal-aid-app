import React, {FC, useCallback, useState} from "react";
import styles from './Header.module.sass';
import classNames from "classnames";
import {Input} from 'antd';
import NotificationsModal from "./notificationsModal/NotificationsModal";
import {IoIosNotificationsOutline} from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import {useAuth} from "../hooks/useAuth";
import NotAuthHeader from "./notAuthHeader/NotAuthHeader";
import {Link} from "react-router-dom";
import { IoMenuOutline } from "react-icons/io5";
import BurgerMenu from "./burderMenu/BurgerMenu";

const Header: FC = () => {
    const {isAuth} = useAuth();
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openBurger, setOpenBurger] = useState<boolean>(false);

    const onChange = useCallback((value: any) => {
        console.log('searching', value)
    }, [])

    const onNotificationsClick = useCallback(() => {
        setOpenModal(!openModal)
    }, [openModal])

    const handleModal = useCallback((val: boolean) => {
        setOpenModal(val)
    },[])

    const handleBurger = useCallback(() => {
        setOpenBurger(!openBurger)
    },[openBurger])

    if (!isAuth) return <NotAuthHeader />

    return (
        <header className={styles['header-content']}>
            <Link to={'/'} className={styles['logo']}>доносы.ру</Link>
            <div
                className={styles['burger-button']}
                onClick={handleBurger}
            >
                <IoMenuOutline size={24} />
            </div>
            <BurgerMenu open={openBurger} onClose={handleBurger} />
            <div className={styles['center-header-panel']}>
                <div className={styles['search']}>
                    <IoSearchOutline size={16} />
                    <Input
                        placeholder="Поиск"
                        bordered={false}
                        onChange={onChange}
                        style={{ width: 200 }}
                    />
                </div>
            </div>
            <div className={styles['right-header-panel']}>
                <div
                    className={classNames(
                        styles['notification-button'],
                        openModal && styles['notification-button-active']
                    )}
                    onClick={onNotificationsClick}
                >
                    <IoIosNotificationsOutline size={20} />
                </div>
                <NotificationsModal
                    setOpenModal={handleModal}
                    open={openModal}
                />
            </div>
        </header>
    );
}

export default Header;