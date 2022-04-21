import React from "react";
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

const Navbar = () => {

    const clickHandler = (e) => {
        let arrowParent = e.target.parentElement.parentElement;
        arrowParent.classList.toggle("showMenu");
    };

    return (
        <>
            <div className={`${navbar_styles.sidebar}`}>
                <div className={`${navbar_styles.logo_details}`}>
                    <i className={`${navbar_styles.logo_icon}`}><ImHammer2/></i>
                    <span className={`${navbar_styles.logo_name}`}>Svod&nbsp;Company</span>
                </div>
                <ul className={`${navbar_styles.nav_links}`}>
                    <li>
                        <a href="/menu">
                            <i className={`${navbar_styles.navbar_icon}`}><CgMenuGridO/></i>
                            <span className={`${navbar_styles.link_name}`}>Меню</span>
                        </a>
                        <ul className={navbar_styles.sub_menu + ' ' + navbar_styles.blank}>
                            <li><a className={`${navbar_styles.link_name}`} href="/menu">Меню</a></li>
                        </ul>
                    </li>
                    <li>
                        <div className={`${navbar_styles.icon_link}`}>
                            <a href="/myRequests">
                                <i className={`${navbar_styles.navbar_icon}`}><BiCollection/></i>
                                <span className={`${navbar_styles.link_name}`}>Мои&nbsp;обращения</span>
                            </a>
                            <i className={`${navbar_styles.navbar_icon}`} onClick={clickHandler}><IoIosArrowDown/></i>
                        </div>
                        <ul className={`${navbar_styles.sub_menu}`}>
                            <li><a className={`${navbar_styles.link_name}`} href="/myRequests">Мои обращения</a></li>
                            <li><a href="#">Жалобы</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="/newRequest">
                            <i className={`${navbar_styles.navbar_icon}`}><BsFileEarmarkPlus/></i>
                            <span className={`${navbar_styles.link_name}`}>Новое&nbsp;обращение</span>
                        </a>
                        <ul className={navbar_styles.sub_menu + ' ' + navbar_styles.blank}>
                            <li><a className={`${navbar_styles.link_name}`} href="/newRequest">Новое обращение</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="/chat">
                            <i className={`${navbar_styles.navbar_icon}`}><BsChatRightText/></i>
                            <span className={`${navbar_styles.link_name}`}>Чат&nbsp;с&nbsp;юристом</span>
                        </a>
                        <ul className={navbar_styles.sub_menu + ' ' + navbar_styles.blank}>
                            <li><a className={`${navbar_styles.link_name}`} href="/chat">Чат с юристом</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="/settings">
                            <i className={`${navbar_styles.navbar_icon}`}><FiSettings/></i>
                            <span className={`${navbar_styles.link_name}`}>Настройки</span>
                        </a>
                        <ul className={navbar_styles.sub_menu + ' ' + navbar_styles.blank}>
                            <li><a className={`${navbar_styles.link_name}`} href="/settings">Настройки</a></li>
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