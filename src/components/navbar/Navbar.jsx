import React, {useContext, useState} from "react";
import navbar_styles from './Navbar.module.css';
import Cock from '../img/cock.png';
import {Icon} from '@iconify/react';
import {ImHammer2} from 'react-icons/im';
import {IoIosLogOut} from 'react-icons/io';
import {IoIosArrowDown} from 'react-icons/io';
import {NavLink, useNavigate} from "react-router-dom";
import NavbarContext from "../../App/context/NavbarContext";
import axios from "../../service/api/axios";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const [isActive, setActive] = useState(false);
    const { isNavbarClose } = useContext(NavbarContext);

    const clickHandler = () => {
        setActive(!isActive);
    }

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

    return (<>
        <div className={`${navbar_styles.sidebar} ${isNavbarClose && navbar_styles.close}`}>
            <div className={navbar_styles.logo_details}>
                <i className={navbar_styles.logo_icon}><ImHammer2/></i>
                <span className={navbar_styles.logo_name}>Juster</span>
            </div>
            <div className={navbar_styles.tabs_container}>
                <NavLink to="/" className={navbar_styles.tab}>
                    <i className={navbar_styles.tab_icon}><Icon icon="ep:menu" color="#e4e9f7" height="35"/></i>
                    <div className={navbar_styles.tab_text}>Главная</div>
                </NavLink>
                <NavLink to="/myRequests" className={navbar_styles.tab}>
                    <i className={`${navbar_styles.tab_icon}`}><Icon icon="fluent:document-arrow-right-20-filled" color="#e4e9f7" height="35"/></i>
                    <div className={navbar_styles.tab_text}>Мои&nbsp;обращения</div>
                </NavLink>
                <NavLink to="/newRequest" className={navbar_styles.tab}>
                    <i className={`${navbar_styles.tab_icon}`}><Icon icon="fluent:document-add-20-filled" color="#e4e9f7" height="35"/></i>
                    <div className={navbar_styles.tab_text}>Новое&nbsp;сообщение</div>
                </NavLink>
            </div>
            <div className={navbar_styles.navbar_footer}>
                <div className={navbar_styles.footer_img}>
                    <img src={Cock} alt="profileImg"/>
                </div>
                {!isNavbarClose && (
                    <>
                        <div className={navbar_styles.footer_name}>Пувел&nbsp;Диареевич</div>
                        <div className={navbar_styles.footer_exit}>
                            <i onClick={clickLogOut}>
                                <Icon
                                    icon="charm:sign-out"
                                    color="#e4e9f7"
                                    height="16"
                                />
                            </i>
                        </div>
                    </>
                )}
            </div>
        </div>
    </>);
}

export default Navbar;