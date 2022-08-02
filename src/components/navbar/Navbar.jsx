import React, {useContext, useState} from "react";
import navbar_styles from './Navbar.module.css';
import Cock from '../img/cock.png';
import {Icon} from '@iconify/react';
import {ImHammer2} from 'react-icons/im';
import {IoIosLogOut} from 'react-icons/io';
import {IoIosArrowDown} from 'react-icons/io';
import {NavLink, useNavigate} from "react-router-dom";
import NavbarContext from "../../context/NavbarContext";
import axios from "../../service/api/axios";
import useAuth from "../hooks/useAuth";

const Navbar = () => {

    const auth = useAuth();
    const navigate = useNavigate();
    const [isActive, setActive] = useState(false);

    const clickHandler = () => {
        setActive(!isActive);
    }

    const {isNavbarClose} = useContext(NavbarContext);

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
        <div className={`${navbar_styles.sidebar} ${+" " + isNavbarClose ? navbar_styles.close : ''}`}>
            <div className={`${navbar_styles.logo_details}`}>
                <i className={`${navbar_styles.logo_icon}`}><ImHammer2/></i>
                <span className={`${navbar_styles.logo_name}`}>Juster</span>
            </div>
            <ul className={`${navbar_styles.nav_links}`}>
                <li>
                    <NavLink to="/menu">
                        <i className={`${navbar_styles.navbar_icon}`}><Icon icon="ep:menu" color="#e4e9f7" height="35"/></i>
                        <span className={`${navbar_styles.link_name}`}>Меню</span>
                    </NavLink>
                    <ul className={navbar_styles.sub_menu + ' ' + navbar_styles.blank}>
                        <li><NavLink className={`${navbar_styles.link_name}`} to="/menu">Меню</NavLink></li>
                    </ul>
                </li>
                <li className={`${isActive ? navbar_styles.showMenu : ''}`}>
                    <div className={`${navbar_styles.icon_link}`}>
                        <NavLink to="/myRequests">
                            <i className={`${navbar_styles.navbar_icon}`}><Icon
                                icon="fluent:document-arrow-right-20-filled" color="#e4e9f7" height="35"/></i>
                            <span className={`${navbar_styles.link_name}`}>Мои&nbsp;обращения</span>
                        </NavLink>
                    </div>
                </li>
                <li>
                    <NavLink to="/newRequest">
                        <i className={`${navbar_styles.navbar_icon}`}><Icon icon="fluent:document-add-20-filled"
                                                                            color="#e4e9f7" height="35"/></i>
                        <span className={`${navbar_styles.link_name}`}>Новое&nbsp;обращение</span>
                    </NavLink>
                    <ul className={navbar_styles.sub_menu + ' ' + navbar_styles.blank}>
                        <li><NavLink className={`${navbar_styles.link_name}`} to="/newRequest">Новое
                            обращение</NavLink></li>
                    </ul>
                </li>
                <li>
                    <div className={`${navbar_styles.profile_details}`}>
                        <div className={`${navbar_styles.profile_content}`}>
                            <img src={Cock} alt="profileImg"/>
                        </div>
                        <div className="name_job">
                            <div className={`${navbar_styles.profile_name}`}>Pavel Klak</div>
                            <div className={`${navbar_styles.job}`}>Developer</div>
                        </div>
                        <i className={`${navbar_styles.navbar_icon}`} onClick={clickLogOut}><Icon icon="charm:sign-out"
                                                                                                  color="#e4e9f7"
                                                                                                  height="20"/></i>
                    </div>
                </li>
            </ul>
        </div>
    </>);
}

export default Navbar;