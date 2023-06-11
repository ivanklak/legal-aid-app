import React, {FC, useContext} from "react";
import styles from './Header.module.css';
import NavbarContext from "../../App/context/NavbarContext";

const Header: FC = () => {
    const {isNavbarClose} = useContext(NavbarContext);

    return (
        <div className={styles.home_content}>
            <span className={styles.text}>доносы.ру</span>
        </div>
    );
}

export default Header;