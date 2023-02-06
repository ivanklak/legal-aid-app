import React, {FC, useContext} from "react";
import styles from './Header.module.css';
import NavbarContext from "../../App/context/NavbarContext";

const Header: FC = () => {
    const {isNavbarClose} = useContext(NavbarContext);

    return (
        <div className={`${styles.home_content} ${isNavbarClose ? styles.width : ''}`}>
            <span className={`${styles.text}`}></span>
        </div>
    );
}

export default Header;