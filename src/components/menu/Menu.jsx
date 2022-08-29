import React, {useContext} from "react";
import menu_styles from '../../App.module.css';
import NavbarContext from "../../App/context/NavbarContext";

const Menu = (props) => {

    const {isNavbarClose} = useContext(NavbarContext);

    return (
        <>
            <div className={`${menu_styles.home_content} ${+' ' + isNavbarClose ? menu_styles.width : ''}`}>
                <div></div>
                <div></div>

            </div>
        </>
    );
}

export default Menu;