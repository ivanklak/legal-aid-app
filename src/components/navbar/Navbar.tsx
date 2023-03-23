import React, {FC, useContext, useEffect, useState} from "react";
import navbar_styles from './Navbar.module.css';
// @ts-ignore
import Cock from '../img/cock.png';
import {Icon} from '@iconify/react';
import {ImHammer2} from 'react-icons/im';
import {useLocation, useNavigate} from "react-router-dom";
import NavbarContext from "../../App/context/NavbarContext";
import axios from "../../service/api/axios";
import useAuth from "../hooks/useAuth";
import classNames from "classnames";
import Tab from "./tab/Tab";
import { IoIosArrowForward } from "react-icons/io";

enum Pathname {
    Home = "/",
    Category = '/category',
    MyRequests = '/myRequests',
    NewRequest = '/newRequest',
    Notifications = '/notifications'
}

const Navbar: FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isActive, setActive] = useState(false);
    const { isNavbarClose, setIsNavbarClose } = useContext(NavbarContext);
    const [currentPage, setCurrentPage] = useState<Pathname>(Pathname.Home)

    const clickHandler = () => {
        setActive(!isActive);
    }

    useEffect(() => {
        setCurrentPage(location.pathname as Pathname)
    }, [location])

    const clickLogOut = async () => {
        const userName = auth?.auth?.email
        try {
            const response = await axios.post("/auth/logout",
                JSON.stringify({userName}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                })
            navigate("../login", {replace: true});
            console.log(auth);
        } catch (err) {
        }
    }

    const closeOrOpenNavbar = () => {
        setIsNavbarClose(!isNavbarClose)
    }

    return (
        <div className={classNames(navbar_styles.sidebar, isNavbarClose && navbar_styles.close)}>
            <div className={navbar_styles.logo_details}>
                <i className={navbar_styles.logo_icon}><ImHammer2/></i>
                <span className={navbar_styles.logo_name}>Juster</span>
            </div>
            <div className={navbar_styles.open_block}>
                <div className={navbar_styles.icon_container}>
                    <i
                        className={classNames(
                            navbar_styles.open_icon,
                            !isNavbarClose && navbar_styles.touched
                        )}
                        onClick={closeOrOpenNavbar}
                    >
                        <IoIosArrowForward/>
                    </i>
                </div>
            </div>
            <div className={navbar_styles.tabs_container}>
                <Tab
                    path='/'
                    name='Главная'
                    icon={<Icon icon="ep:menu" height="25"/>}
                    isNavbarClose={isNavbarClose}
                    isActive={currentPage === Pathname.Home}
                />
                <Tab
                    path='/category'
                    name='Категории'
                    icon={<Icon icon="heroicons:rectangle-stack-20-solid" height="25"/>}
                    isNavbarClose={isNavbarClose}
                    isActive={currentPage === Pathname.Category}
                />
                <Tab
                    path='/myRequests'
                    name='Мои&nbsp;обращения'
                    icon={<Icon icon="fluent:document-arrow-right-20-filled" height="25"/>}
                    isNavbarClose={isNavbarClose}
                    isActive={currentPage === Pathname.MyRequests}
                />
                <Tab
                    path='/newRequest'
                    name='Новое&nbsp;обращение'
                    icon={<Icon icon="fluent:document-add-20-filled" height="25"/>}
                    isNavbarClose={isNavbarClose}
                    isActive={currentPage === Pathname.NewRequest}
                />
                <Tab
                    path={'/notifications'}
                    name={'Уведомления'}
                    icon={<Icon icon="ion:notifications" height="25"/>}
                    isNavbarClose={isNavbarClose}
                    isActive={currentPage === Pathname.Notifications}
                />
            </div>
            <div className={navbar_styles.navbar_footer}>
                <div className={navbar_styles.footer_img}>
                    <img src={Cock} alt="profileImg"/>
                </div>
                <div className={classNames(
                    navbar_styles.footer_info,
                    isNavbarClose && navbar_styles.footer_info_hide
                )}>
                    <div>
                        <div className={navbar_styles.greeting}>Добрый день</div>
                        <div className={navbar_styles.footer_name}>Пувел&nbsp;Диареевич</div>
                    </div>
                    <div className={navbar_styles.footer_exit}>
                        <i onClick={clickLogOut}>
                            <Icon
                                icon="charm:sign-out"
                                color="var(--base-color__text_light)"
                                height="16"
                            />
                        </i>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;