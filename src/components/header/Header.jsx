import React, {useContext, useState} from "react";
import header_styles from './Header.module.css';
import {HiMenu} from 'react-icons/hi';
import NavbarContext from "../../context/NavbarContext";

const Header = (props) => {

    const {isNavbarClose, setClose} = useContext(NavbarContext);

    const closeOpenNavbar = () => {
        setClose(!isNavbarClose);
    }

    return (
        <div className={`${header_styles.home_content} ${isNavbarClose ? header_styles.width : ''}`}>
            <i className={`${header_styles.menu_icon}`} onClick={closeOpenNavbar}><HiMenu/></i>
            <span className={`${header_styles.text}`}></span>
        </div>
    );
}

export default Header;