import React, {FC} from "react";
import styles from "./Tab.module.css";
import {NavLink} from "react-router-dom";
import classNames from "classnames";

interface TabProps {
    path: string;
    name: string;
    icon: JSX.Element;
    isNavbarClose: boolean
}

const Tab: FC<TabProps> = ({path, name, icon, isNavbarClose}) => {
    return (
        <NavLink to={path} className={styles.tab}>
            <i className={styles.icon}>{icon}</i>
            <div className={classNames(
                styles.name,
                isNavbarClose && styles.hide_name
            )}>{name}</div>
        </NavLink>
    )
}

export default Tab;