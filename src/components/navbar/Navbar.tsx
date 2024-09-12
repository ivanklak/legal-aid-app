import React, {FC, useEffect, useState} from "react";
import styles from './Navbar.module.sass';
import {useLocation} from "react-router-dom";
import Tab from "./tab/Tab";
import NavbarAccount from "./account/NavbarAccount";
import { RxDashboard } from "react-icons/rx";
import { BsBoxes } from "react-icons/bs";
import { IoDocumentOutline } from "react-icons/io5";
import { HiOutlineDocumentPlus } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io"

enum Pathname {
    Home = "/dashboard",
    Category = '/category',
    MyRequests = '/myRequests',
    NewRequest = '/newRequest',
    Notifications = '/notifications'
}

const Navbar: FC = () => {
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState<Pathname>(Pathname.Home)

    useEffect(() => {
        setCurrentPage(location.pathname as Pathname)
    }, [location])

    return (
        <aside className={styles['navbar']}>
            <NavbarAccount />
            <div className={styles['tabs-container']}>
                <Tab
                    path='/dashboard'
                    name='Главная'
                    icon={<RxDashboard size={16} />}
                    isActive={currentPage === Pathname.Home}
                />
                <Tab
                    path='/category'
                    name='Категории'
                    icon={<BsBoxes size={16} />}
                    isActive={currentPage === Pathname.Category}
                />
                <Tab
                    path='/myRequests'
                    name='Мои&nbsp;обращения'
                    icon={<IoDocumentOutline size={16} />}
                    isActive={currentPage === Pathname.MyRequests}
                />
                <Tab
                    path='/newRequest'
                    name='Новое&nbsp;обращение'
                    icon={<HiOutlineDocumentPlus size={16} />}
                    isActive={currentPage === Pathname.NewRequest}
                />
                <Tab
                    path={'/notifications'}
                    name={'Уведомления'}
                    icon={<IoIosNotificationsOutline size={19} />}
                    isActive={currentPage === Pathname.Notifications}
                />
            </div>
        </aside>
    );
}

export default Navbar;