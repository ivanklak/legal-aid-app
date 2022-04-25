import React, {useState} from "react";
import header_styles from './Header.module.css';
import { HiMenu } from 'react-icons/hi';

const Header = (props) => {

    const [isActive, setActive] = useState(false);

    const toggleClass = () => {
        setActive(!isActive);
    }

    return (
        <>
            <div className={`${header_styles.home_content}`}>
                <i className={`${header_styles.menu_icon}`} onClick={toggleClass}><HiMenu/></i>
                <span className={`${header_styles.text}`}>Drop Down Sidebar</span>
            </div>
        </>
    );
}

export default Header;