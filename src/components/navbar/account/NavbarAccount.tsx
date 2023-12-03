import React, {memo} from "react";
import styles from "./NavbarAccount.module.sass";
import { IoSettingsOutline } from "react-icons/io5";
import { BsChevronDown } from "react-icons/bs";

const NavbarAccount = memo(() => {
    return (
        <div className={styles['navbar-account']}>
            <div className={styles['account-name']}>
                <div>Пувел Диареевич</div>
                <BsChevronDown size={10} />
            </div>
            <a
                href={'/account/settings'}
                className={styles['account-settings']}
            >
                <IoSettingsOutline size={16} />
            </a>
        </div>
    )
})

export default NavbarAccount