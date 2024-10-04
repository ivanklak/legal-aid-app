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
import { IoHelpCircleOutline } from "react-icons/io5";
import { RiTeamLine } from "react-icons/ri";
import { GoHome } from "react-icons/go";
import {useAuth} from "../../../app/hooks/useAuth";

enum Pathname {
    Home = '/',
    Dashboard = "/mySpace/dashboard",
    Category = '/mySpace/category',
    MyRequests = '/mySpace/myRequests',
    NewRequest = '/mySpace/newRequest',
    Notifications = '/mySpace/notifications',
    Support = '/support',
    UseCases = '/use-cases',
    Contacts = '/contacts'
}

interface BurgerMenuProps {
    open: boolean;
    onClose: () => void;
}

const BurgerMenu = memo<BurgerMenuProps>(({open, onClose}) => {
    const location = useLocation();
    const {userData} = useAuth();
    const [currentPage, setCurrentPage] = useState<Pathname>(Pathname.Home);

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
                    <NavbarAccount onClick={handleTabClick} />
                </div>
                <div className={styles['tabs-container']}>
                    <Tab
                        path='/'
                        name='Главная'
                        icon={<GoHome size={16} />}
                        isActive={currentPage === Pathname.Home}
                        onClick={handleTabClick}
                    />
                    {userData && <div className={styles['divider']} />}
                    <Tab
                        path='/mySpace/dashboard'
                        name='Мое пространство'
                        icon={<RxDashboard size={16} />}
                        isActive={currentPage === Pathname.Dashboard}
                        onClick={handleTabClick}
                    />
                    {userData && (
                       <>
                           <Tab
                               path='/mySpace/category'
                               name='Категории'
                               icon={<BsBoxes size={16} />}
                               isActive={currentPage === Pathname.Category}
                               onClick={handleTabClick}
                               disabled={!userData}
                           />
                           <Tab
                               path='/mySpace/myRequests'
                               name='Мои&nbsp;обращения'
                               icon={<IoDocumentOutline size={16} />}
                               isActive={currentPage === Pathname.MyRequests}
                               onClick={handleTabClick}
                               disabled={!userData}
                           />
                           <Tab
                               path='/mySpace/newRequest'
                               name='Новое&nbsp;обращение'
                               icon={<HiOutlineDocumentPlus size={16} />}
                               isActive={currentPage === Pathname.NewRequest}
                               onClick={handleTabClick}
                               disabled={!userData}
                           />
                           <Tab
                               path={'/mySpace/notifications'}
                               name={'Уведомления'}
                               icon={<IoIosNotificationsOutline size={19} />}
                               isActive={currentPage === Pathname.Notifications}
                               onClick={handleTabClick}
                               disabled={!userData}
                           />
                           <div className={styles['divider']} />
                       </>
                    )}
                    <Tab
                        path='/use-cases'
                        name='Возможности'
                        icon={<BsBoxes size={16} />}
                        isActive={currentPage === Pathname.UseCases}
                        onClick={handleTabClick}
                    />
                    <Tab
                        path='/support'
                        name='Помощь'
                        icon={<IoHelpCircleOutline size={16} />}
                        isActive={currentPage === Pathname.Support}
                        onClick={handleTabClick}
                    />
                    <Tab
                        path='/contacts'
                        name='Контакты'
                        icon={<RiTeamLine size={16} />}
                        isActive={currentPage === Pathname.Contacts}
                        onClick={handleTabClick}
                    />
                </div>
            </div>
        </div>
    )
})

export default BurgerMenu;