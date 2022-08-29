import React, {useContext} from "react";
import header_styles from './Header.module.css';
import {HiMenu} from 'react-icons/hi';
import NavbarContext from "../../App/context/NavbarContext";

const Header = () => {

    const {isNavbarClose, setIsNavbarClose} = useContext(NavbarContext);

    const closeOpenNavbar = () => {
        setIsNavbarClose(!isNavbarClose);
    }

    return (
        <div className={`${header_styles.home_content} ${isNavbarClose ? header_styles.width : ''}`}>
            <i className={`${header_styles.menu_icon}`} onClick={closeOpenNavbar}><HiMenu/></i>
            <span className={`${header_styles.text}`}></span>
        </div>
    );
}

export default Header;