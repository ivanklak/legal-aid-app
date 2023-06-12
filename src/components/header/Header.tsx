import React, {FC, useCallback, useContext} from "react";
import styles from './Header.module.css';
import NavbarContext from "../../App/context/NavbarContext";
import {BsPersonFill} from "react-icons/bs";
import {RiSettings3Line} from "react-icons/ri";
import {IoNotifications} from "react-icons/io5";
import classNames from "classnames";
import {Input, Tooltip} from 'antd';
const { Search } = Input;


const Header: FC = () => {
    const {isNavbarClose} = useContext(NavbarContext);

    const onSearch = useCallback((value: string) => {
        console.log('searching', value)
    }, [])

    return (
        <div className={styles.home_content}>
            <span className={styles.text}>доносы.ру</span>
            <div className={styles.center_header_panel}></div>
            <div className={styles.right_header_panel}>
                <div className={styles.search}>
                    <Search placeholder="input search text" allowClear onSearch={onSearch} style={{ width: 200 }} />
                </div>
                <Tooltip color="#37445299" title="Уведомления">
                    <div className={classNames(
                        styles.panel_item,
                        styles.notification_button
                    )}>
                        <IoNotifications size={20}/>
                    </div>
                </Tooltip>
                <Tooltip color="#37445299" title="Настройки">
                    <div className={classNames(
                        styles.panel_item,
                        styles.settings_button
                    )}>
                        <RiSettings3Line size={20} />
                    </div>
                </Tooltip>
                <Tooltip color="#37445299" title="Аккаунт">
                    <div className={classNames(
                        styles.panel_item,
                        styles.account_button
                    )}>
                        <div className={styles.account_button_background}>
                            <BsPersonFill color={'white'} />
                        </div>
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}

export default Header;