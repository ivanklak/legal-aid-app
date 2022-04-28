import React, {useContext} from "react";
import menu_styles from '../../App.module.css';
import NavbarContext from "../../context/NavbarContext";

const Menu = (props) => {

    const {isNavbarClose} = useContext(NavbarContext);

    return (
        <>
            <section className={`${menu_styles.home_content} ${+' ' + isNavbarClose ? menu_styles.width : ''}`}>
                <h1>Menu</h1>
            </section>
        </>
    );
}

export default Menu;