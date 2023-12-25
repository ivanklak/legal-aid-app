import React, {FC, useEffect, useState} from "react";
import navbar_styles from './Navbar.module.css';
// @ts-ignore
import {useLocation, useNavigate} from "react-router-dom";
import axios from "../../service/api/axios";
import {useAuth} from "../hooks/useAuth";
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
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState<Pathname>(Pathname.Home)

    useEffect(() => {
        setCurrentPage(location.pathname as Pathname)
    }, [location])

    const clickLogOut = async () => {
        const userName = auth?.userData.firstName
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

    return (
        <aside className={navbar_styles.navbar}>
            <NavbarAccount />
            <div className={navbar_styles.tabs_container}>
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
            {/*<div className={navbar_styles.navbar_footer}>*/}
            {/*    <div className={navbar_styles.footer_img}>*/}
            {/*        <img src={Cock} alt="profileImg"/>*/}
            {/*    </div>*/}
            {/*    <div className={classNames(*/}
            {/*        navbar_styles.footer_info,*/}
            {/*        isNavbarClose && navbar_styles.footer_info_hide*/}
            {/*    )}>*/}
            {/*        <div>*/}
            {/*            <div className={navbar_styles.greeting}>Добрый день</div>*/}
            {/*            <div className={navbar_styles.footer_name}>Пувел&nbsp;Диареевич</div>*/}
            {/*        </div>*/}
            {/*        <div className={navbar_styles.footer_exit}>*/}
            {/*            <i onClick={clickLogOut}>*/}
            {/*                <Icon*/}
            {/*                    icon="charm:sign-out"*/}
            {/*                    color="var(--base-color__text_light)"*/}
            {/*                    height="16"*/}
            {/*                />*/}
            {/*            </i>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </aside>
    );
}

export default Navbar;