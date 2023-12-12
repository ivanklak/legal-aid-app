import React, {memo, useEffect} from "react";
import styles from "./NavbarAccount.module.sass";
import { IoSettingsOutline } from "react-icons/io5";
import { BsChevronDown } from "react-icons/bs";
import {Link, useLocation} from "react-router-dom";
import classNames from "classnames";

const NavbarAccount = memo(() => {
    const location = useLocation();

    return (
        <div className={styles['navbar-account']}>
            <div className={styles['account-name']}>
                <div>Пувел Диареевич</div>
                <BsChevronDown size={10} />
            </div>
            <Link
                to={'/account/settings'}
                className={classNames(
                    styles['account-settings'],
                    location.pathname === '/account/settings' && styles['_active']
                )}
            >
                <IoSettingsOutline size={16} />
            </Link>
        </div>
    )
})

export default NavbarAccount