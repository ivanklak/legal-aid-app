import React, {FC, useCallback, useState} from "react";
import styles from './Header.module.css';
import classNames from "classnames";
import {Input} from 'antd';
import NotificationsModal from "./notificationsModal/NotificationsModal";
import {IoIosNotificationsOutline} from "react-icons/io";
import { IoSearchOutline } from "react-icons/io5";
import {useAuth} from "../hooks/useAuth";
import NotAuthHeader from "./notAuthHeader/NotAuthHeader";
import {Link} from "react-router-dom";

const Header: FC = () => {
    const {isAuth} = useAuth();
    const [openModal, setOpenModal] = useState<boolean>(false);

    const onChange = useCallback((value: any) => {
        console.log('searching', value)
    }, [])

    const onNotificationsClick = useCallback(() => {
        setOpenModal(!openModal)
    }, [openModal])

    const handleModal = useCallback((val: boolean) => {
        setOpenModal(val)
    },[])

    if (!isAuth) return <NotAuthHeader />

    return (
        <header className={styles.header_content}>
            <Link to={'/'} className={styles.text}>доносы.ру</Link>
            <div className={styles.center_header_panel}>
                <div className={styles.search}>
                    <IoSearchOutline size={16} />
                    <Input
                        placeholder="Поиск"
                        bordered={false}
                        onChange={onChange}
                        style={{ width: 200 }}
                    />
                </div>
            </div>
            <div className={styles.right_header_panel}>
                <div
                    className={classNames(
                        styles.notification_button,
                        openModal && styles.notification_button_active
                    )}
                    onClick={onNotificationsClick}
                >
                    <IoIosNotificationsOutline size={20} />
                </div>
                <NotificationsModal setOpenModal={handleModal} open={openModal} />
                {/*<Tooltip color="#37445299" title="Настройки">*/}
                {/*    <div className={classNames(*/}
                {/*        styles.panel_item,*/}
                {/*        styles.settings_button*/}
                {/*    )}>*/}
                {/*        <RiSettings3Line size={20} />*/}
                {/*    </div>*/}
                {/*</Tooltip>*/}
                {/*<Tooltip color="#37445299" title="Аккаунт">*/}
                {/*    <div className={classNames(*/}
                {/*        styles.panel_item,*/}
                {/*        styles.account_button*/}
                {/*    )}>*/}
                {/*        <div className={styles.account_button_background}>*/}
                {/*            <BsPersonFill color={'white'} />*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</Tooltip>*/}
            </div>
        </header>
    );
}

export default Header;