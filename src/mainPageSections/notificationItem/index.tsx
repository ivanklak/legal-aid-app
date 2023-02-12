import React, {FC} from 'react';
import styles from "./NotificationItem.module.css";
import {INotifications} from "../mainPage/MainPage";
import classNames from "classnames";

interface NotificationItemProps {
    item: INotifications
    isRead: boolean
}

const NotificationItem: FC<NotificationItemProps> = ({item, isRead}) => {
    return (
        <div className={styles.notificationItem}>
            <div className={classNames(
                styles.itemIcon,
                isRead && styles.readIcon
            )}/>
            <div className={styles.itemDescription}>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.itemId}>Ваше обращение...</div>
            </div>
            <div className={styles.itemTime}>{item.sentTime}</div>
        </div>
    )
}

export default NotificationItem;