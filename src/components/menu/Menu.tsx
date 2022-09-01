import React, {FC, useContext, useState} from "react";
import styles from "./Menu.module.css";
import NavbarContext from "../../App/context/NavbarContext";
import AppealsItem from "../AppealsItem";
import NotificationItem from "../NotificationItem";
import {useNavigate} from "react-router-dom";

export enum Status {
    success = "Решено",
    inProcess = "Запрос информации",
    sent = "Отправлено",
}

export enum NotificationsTitle {
    success = "Обращение решено",
    newStatus = "Новый статус обращения",
    sent = "Обращение отправлено"
}

export interface IAppeals {
    id: number
    date: string
    title: string
    description: string
    shortDescription: string
    status: Status
}

export interface INotifications {
    id: number
    sentTime: string
    title: NotificationsTitle
}

const Menu: FC = () => {
    const navigate = useNavigate();
    const { isNavbarClose } = useContext(NavbarContext);
    const [isFullNotificationsShowing, setIsFullNotificationsShowing] = useState<boolean>(false);

    const appealsFromServer: Array<IAppeals> = [
        {id: 10003, date: '24.03.2022', title: 'Название жалобы', description: 'Длиииинный текст', shortDescription: 'Короткое описание', status: Status.success},
        {id: 10002, date: '12.03.2022', title: 'Название жалобы', description: 'Длиииинный текст', shortDescription: 'Короткое описание', status: Status.inProcess},
        {id: 10001, date: '02.03.2022', title: 'Название жалобы', description: 'Длиииинный текст', shortDescription: 'Короткое описание', status: Status.sent}
    ]

    const notificationsFromServer: Array<INotifications> = [
        {id: 10003, sentTime: '2 минуты назад', title: NotificationsTitle.sent},
        {id: 10002, sentTime: '5 минут назад', title: NotificationsTitle.success},
        {id: 10003, sentTime: '30 минут назад', title: NotificationsTitle.newStatus},
        {id: 10012, sentTime: '1 час назад', title: NotificationsTitle.newStatus},
        {id: 10007, sentTime: '2 часа назад', title: NotificationsTitle.sent},
        {id: 10011, sentTime: '5 часов назад', title: NotificationsTitle.newStatus},
        {id: 10001, sentTime: '07.08.2022', title: NotificationsTitle.sent},
        {id: 10004, sentTime: '30.07.2022', title: NotificationsTitle.newStatus},
        {id: 10006, sentTime: '12.04.2022', title: NotificationsTitle.success},
        {id: 10010, sentTime: '07.08.2022', title: NotificationsTitle.success},
        {id: 10010, sentTime: '07.08.2022', title: NotificationsTitle.success},
        {id: 10010, sentTime: '07.08.2022', title: NotificationsTitle.success},
        {id: 10010, sentTime: '07.08.2022', title: NotificationsTitle.success},
        {id: 10010, sentTime: '07.08.2022', title: NotificationsTitle.success},
        {id: 10010, sentTime: '07.08.2022', title: NotificationsTitle.success},
    ]

    const onAllAppealsClick = () => {
        return navigate('myRequests')
    }

    const onAllNotificationsClick = () => {
        setIsFullNotificationsShowing(!isFullNotificationsShowing);
    }

    return (
        <>
            <div className={`${styles.home_content} ${+' ' + isNavbarClose ? styles.width : ''}`}>
                <div className={styles.menu}>
                    <div className={styles.appeals}>
                        <div className={styles.caption}>Обращения</div>
                        {appealsFromServer.map((item) => (
                            <AppealsItem item={item} />
                        ))}
                        <div className={styles.allAppeals} onClick={onAllAppealsClick}>Все обращения</div>
                    </div>
                    <div className={styles.notifications}>
                        <div className={styles.caption}>Уведомления</div>
                        <div className={styles.notificationsContainer}>
                            <div className={isFullNotificationsShowing ? styles.fullNotificationsContainer : styles.shortNotificationsContainer}>
                                {notificationsFromServer.map((item) => (
                                    <NotificationItem item={item} />
                                ))}
                            </div>
                        </div>
                        <div className={styles.allNotifications} onClick={onAllNotificationsClick}>
                            {isFullNotificationsShowing ? "Свернуть" : "Все уведомления"}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Menu;