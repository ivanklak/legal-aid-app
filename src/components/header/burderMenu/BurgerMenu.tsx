import React, {memo, useEffect, useState} from "react";
import NavbarAccount from "../../navbar/account/NavbarAccount";
import styles from "./BurgerMenu.module.sass";
import Tab from "../../navbar/tab/Tab";
import {RxDashboard} from "react-icons/rx";
import {BsBoxes} from "react-icons/bs";
import {IoDocumentOutline} from "react-icons/io5";
import {HiOutlineDocumentPlus} from "react-icons/hi2";
import {IoIosNotificationsOutline} from "react-icons/io";
import {useLocation} from "react-router-dom";
import classNames from "classnames";
import {IoClose} from "react-icons/io5";

enum Pathname {
    Home = "/dashboard",
    Category = '/category',
    MyRequests = '/myRequests',
    NewRequest = '/newRequest',
    Notifications = '/notifications'
}

interface BurgerMenuProps {
    open: boolean;
    onClose: () => void;
}

const BurgerMenu = memo<BurgerMenuProps>(({open, onClose}) => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState<Pathname>(Pathname.Home)

    useEffect(() => {
        setCurrentPage(location.pathname as Pathname)
    }, [location])

    const handleCloseClick = () => {
        onClose();
    }

    const handleTabClick = () => {
        onClose();
    }

    return (
        <div className={classNames(styles['burger-menu'], open && styles['_open'])}>
            <div className={styles['content']}>
                <div className={styles['close-button']} onClick={handleCloseClick}>
                    <IoClose size={24} />
                </div>
                <div className={styles['account-container']}>
                    <NavbarAccount />
                </div>
                <div className={styles['tabs-container']}>
                    <Tab
                        path='/dashboard'
                        name='Главная'
                        icon={<RxDashboard size={16} />}
                        isActive={currentPage === Pathname.Home}
                        onClick={handleTabClick}
                    />
                    <Tab
                        path='/category'
                        name='Категории'
                        icon={<BsBoxes size={16} />}
                        isActive={currentPage === Pathname.Category}
                        onClick={handleTabClick}
                    />
                    <Tab
                        path='/myRequests'
                        name='Мои&nbsp;обращения'
                        icon={<IoDocumentOutline size={16} />}
                        isActive={currentPage === Pathname.MyRequests}
                        onClick={handleTabClick}
                    />
                    <Tab
                        path='/newRequest'
                        name='Новое&nbsp;обращение'
                        icon={<HiOutlineDocumentPlus size={16} />}
                        isActive={currentPage === Pathname.NewRequest}
                        onClick={handleTabClick}
                    />
                    <Tab
                        path={'/notifications'}
                        name={'Уведомления'}
                        icon={<IoIosNotificationsOutline size={19} />}
                        isActive={currentPage === Pathname.Notifications}
                        onClick={handleTabClick}
                    />
                </div>
            </div>
        </div>
    )
})

export default BurgerMenu;