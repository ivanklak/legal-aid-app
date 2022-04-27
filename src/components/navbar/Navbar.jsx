import React, {useContext, useState} from "react";
import navbar_styles from './Navbar.module.css';
import Cock from '../img/cock.png';
import {ImHammer2} from 'react-icons/im';
import {IoIosLogOut} from 'react-icons/io';
import {BiCollection} from 'react-icons/bi';
import {IoIosArrowDown} from 'react-icons/io';
import {BsFileEarmarkPlus} from 'react-icons/bs';
import {BsChatRightText} from 'react-icons/bs';
import {FiSettings} from 'react-icons/fi';
import {CgMenuGridO} from 'react-icons/cg';
import {NavLink} from "react-router-dom";
import NavbarContext from "../../context/NavbarContext";

const Navbar = () => {

    const [isActive, setActive] = useState(false);

    const clickHandler = () => {
        setActive(!isActive);
    }

    const {isNavbarClose} = useContext(NavbarContext);

    return (
        <>
            <div className={`${navbar_styles.sidebar} ${+" " + isNavbarClose ? navbar_styles.close : ''}`}>
                <div className={`${navbar_styles.logo_details}`}>
                    <i className={`${navbar_styles.logo_icon}`}><ImHammer2/></i>
                    <span className={`${navbar_styles.logo_name}`}>Svod&nbsp;Company</span>
                </div>
                <ul className={`${navbar_styles.nav_links}`}>
                    <li>
                        <NavLink to="/menu">
                            <i className={`${navbar_styles.navbar_icon}`}><CgMenuGridO/></i>
                            <span className={`${navbar_styles.link_name}`}>Меню</span>
                        </NavLink>
                        <ul className={navbar_styles.sub_menu + ' ' + navbar_styles.blank}>
                            <li><NavLink className={`${navbar_styles.link_name}`} to="/menu">Меню</NavLink></li>
                        </ul>
                    </li>
                    <li className={`${isActive ? navbar_styles.showMenu : ''}`}>
                        <div className={`${navbar_styles.icon_link}`}>
                            <NavLink to="/myRequests">
                                <i className={`${navbar_styles.navbar_icon}`}><BiCollection/></i>
                                <span className={`${navbar_styles.link_name}`}>Мои&nbsp;обращения</span>
                            </NavLink>
                            <i className={navbar_styles.navbar_icon + ' ' + navbar_styles.arrow} onClick={clickHandler}><IoIosArrowDown/></i>
                        </div>
                        <ul className={`${navbar_styles.sub_menu}`}>
                            <li><NavLink className={`${navbar_styles.link_name}`} to="/myRequests">Мои
                                обращения</NavLink></li>
                            <li><NavLink to="#">Жалобы</NavLink></li>
                        </ul>
                    </li>
                    <li>
                        <NavLink to="/newRequest">
                            <i className={`${navbar_styles.navbar_icon}`}><BsFileEarmarkPlus/></i>
                            <span className={`${navbar_styles.link_name}`}>Новое&nbsp;обращение</span>
                        </NavLink>
                        <ul className={navbar_styles.sub_menu + ' ' + navbar_styles.blank}>
                            <li><NavLink className={`${navbar_styles.link_name}`} to="/newRequest">Новое
                                обращение</NavLink></li>
                        </ul>
                    </li>
                    <li>
                        <NavLink to="/chat">
                            <i className={`${navbar_styles.navbar_icon}`}><BsChatRightText/></i>
                            <span className={`${navbar_styles.link_name}`}>Чат&nbsp;с&nbsp;юристом</span>
                        </NavLink>
                        <ul className={navbar_styles.sub_menu + ' ' + navbar_styles.blank}>
                            <li><NavLink className={`${navbar_styles.link_name}`} to="/chat">Чат с юристом</NavLink>
                            </li>
                        </ul>
                    </li>
                    <li>
                        <NavLink to="/settings">
                            <i className={`${navbar_styles.navbar_icon}`}><FiSettings/></i>
                            <span className={`${navbar_styles.link_name}`}>Настройки</span>
                        </NavLink>
                        <ul className={navbar_styles.sub_menu + ' ' + navbar_styles.blank}>
                            <li><NavLink className={`${navbar_styles.link_name}`} to="/settings">Настройки</NavLink>
                            </li>
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
                            <i className={`${navbar_styles.navbar_icon}`}><IoIosLogOut/></i>
                        </div>
                    </li>
                </ul>
            </div>
        </>
    );
}

export default Navbar;