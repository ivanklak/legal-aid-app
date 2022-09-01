import React, {FC} from 'react';
import styles from "./NotificationItem.module.css";
import {INotifications, NotificationsTitle} from "../menu/Menu";

interface NotificationItemProps {
    item: INotifications
}

const NotificationItem: FC<NotificationItemProps> = ({item}) => {
    return (
        <div className={styles.notificationItem}>
            <div className={styles.itemIcon}>
                {item.title === NotificationsTitle.success && <div className={styles.itemSuccessIcon} />}
                {item.title === NotificationsTitle.newStatus && <div className={styles.itemNewStatusIcon} />}
                {item.title === NotificationsTitle.sent && <div className={styles.itemSentIcon} />}
            </div>
            <div className={styles.itemDescription}>
                <div className={styles.itemTitle}>{item.title}</div>
                <div className={styles.itemId}>{`№ ${item.id}`}</div>
            </div>
            <div className={styles.itemTime}>{item.sentTime}</div>
        </div>
    )
}

export default NotificationItem;