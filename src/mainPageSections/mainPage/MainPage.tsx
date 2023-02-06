import React, {FC, useContext, useState} from "react";
import styles from "./MainPage.module.css";
import NavbarContext from "../../App/context/NavbarContext";
import AppealsItem from "../appealsItem";
import NotificationItem from "../notificationItem";
import {useNavigate} from "react-router-dom";
import classNames from "classnames";
import MainWrapper from "../../components/mainWrapper/MainWrapper";

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

const MainPage: FC = () => {
    const navigate = useNavigate();
    const { isNavbarClose } = useContext(NavbarContext);
    const [isFullNotificationsShowing, setIsFullNotificationsShowing] = useState<boolean>(false);

    const appealsFromServer: Array<IAppeals> = [
        {id: 10003, date: '24.03.2022', title: 'Название жалобы', description: 'Длиииинный текст', shortDescription: 'Короткое описание', status: Status.success},
        {id: 10002, date: '12.03.2022', title: 'Название жалобы', description: 'Длиииинный текст', shortDescription: 'Короткое описание', status: Status.inProcess},
        {id: 10001, date: '02.03.2022', title: 'Название жалобы', description: 'Длиииинный текст', shortDescription: 'Короткое описание', status: Status.sent}
    ]

    const notificationsFromServer: Array<INotifications> = [
        {id: 10001, sentTime: '2 минуты назад', title: NotificationsTitle.sent},
        {id: 10002, sentTime: '5 минут назад', title: NotificationsTitle.success},
        {id: 10003, sentTime: '30 минут назад', title: NotificationsTitle.newStatus},
        {id: 10004, sentTime: '1 час назад', title: NotificationsTitle.newStatus},
        {id: 10005, sentTime: '2 часа назад', title: NotificationsTitle.sent},
        {id: 10006, sentTime: '5 часов назад', title: NotificationsTitle.newStatus},
        {id: 10007, sentTime: '07.08.2022', title: NotificationsTitle.sent},
        {id: 10008, sentTime: '30.07.2022', title: NotificationsTitle.newStatus},
        {id: 10009, sentTime: '12.04.2022', title: NotificationsTitle.success},
        {id: 10010, sentTime: '07.08.2022', title: NotificationsTitle.success},
        {id: 10011, sentTime: '07.08.2022', title: NotificationsTitle.success},
        {id: 10012, sentTime: '07.08.2022', title: NotificationsTitle.success},
        {id: 10013, sentTime: '07.08.2022', title: NotificationsTitle.success},
        {id: 10014, sentTime: '07.08.2022', title: NotificationsTitle.success},
        {id: 10015, sentTime: '07.08.2022', title: NotificationsTitle.success},
    ]

    const onAllAppealsClick = () => {
        return navigate('myRequests')
    }

    const onAllNotificationsClick = () => {
        setIsFullNotificationsShowing(!isFullNotificationsShowing);
    }

    return (
        <MainWrapper>
            <div className={classNames(styles.home_content, isNavbarClose && styles.width)}>
                <div className={styles.menu}>
                    <div className={styles.appeals}>
                        <div className={styles.caption}>Обращения</div>
                        {appealsFromServer.map((item) => (
                            <AppealsItem item={item} key={item.id} />
                        ))}
                        <div className={styles.allAppeals} onClick={onAllAppealsClick}>Все обращения</div>
                        <div className={styles.caption}>Новое обращение</div>
                        <div className={styles.newAppeal}>
                            <div className={styles.newAppealPlus}>+</div>
                            <div className={styles.newAppealText}>Создать новое обращение</div>
                        </div>
                    </div>
                    <div className={styles.notifications}>
                        <div className={styles.caption}>Уведомления</div>
                        <div className={styles.notificationsContainer}>
                            <div className={classNames(isFullNotificationsShowing
                                    ? styles.fullNotificationsContainer
                                    : styles.shortNotificationsContainer
                            )}>
                                {notificationsFromServer.map((item) => (
                                    <NotificationItem item={item} key={item.id}/>
                                ))}
                            </div>
                        </div>
                        <div className={styles.allNotifications} onClick={onAllNotificationsClick}>
                            {isFullNotificationsShowing ? "Свернуть" : "Все уведомления"}
                        </div>
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
}

export default MainPage;