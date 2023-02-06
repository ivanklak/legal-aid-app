import React, {FC} from "react";
import styles from "./Tab.module.css";
import {NavLink} from "react-router-dom";
import classNames from "classnames";

interface TabProps {
    path: string;
    name: string;
    icon: JSX.Element;
    isNavbarClose: boolean;
    isActive: boolean;
}

const Tab: FC<TabProps> = ({path, name, icon, isNavbarClose, isActive}) => {
    return (
        <NavLink
            to={path}
            className={classNames(styles.tab, isActive && styles.active)}
        >
            <i className={classNames(
                styles.icon,
                isActive && styles.icon_active
            )}>
                {icon}
            </i>
            <div className={classNames(
                styles.name,
                isNavbarClose && styles.hide_name
            )}>
                {name}
            </div>
        </NavLink>
    )
}

export default Tab;