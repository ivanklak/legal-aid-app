import React, {FC} from "react";
import styles from "./Tab.module.css";
import {NavLink} from "react-router-dom";
import classNames from "classnames";

interface TabProps {
    path: string;
    name: string;
    icon: JSX.Element;
    isActive: boolean;
    onClick?: () => void;
    disabled?: boolean;
}

const Tab: FC<TabProps> = ({path, name, icon, isActive, onClick, disabled}) => {
    return disabled ? (
        <div className={classNames(styles.tab, styles.disabled)}>
            <div className={styles.tab_body}>
                <span className={styles.icon}>{icon}</span>
                <div className={styles.name}>{name}</div>
            </div>
        </div>
    ) : (
        <NavLink
            to={path}
            className={classNames(styles.tab, isActive && styles.active)}
            onClick={onClick}
        >
            <div className={styles.tab_body}>
                <span className={styles.icon}>{icon}</span>
                <div className={styles.name}>{name}</div>
            </div>
        </NavLink>
    )
}

export default Tab;