import React, {FC, useContext} from "react";
import styles from "./MainPage.module.css";
import NavbarContext from "../../App/context/NavbarContext";
import classNames from "classnames";
import MainWrapper from "../../components/mainWrapper/MainWrapper";
import Claims from "../claims/Claims";
import RightSideBar from "../rightSideBar/RightSideBar";

export enum Status {
    success = "Решено",
    inProcess = "В процессе",
    sent = "Отправлено",
    verification = "Верификация",
    waitingForAction = 'Требудется действие'
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
    isRead: boolean
}

const MainPage: FC = () => {
    const { isNavbarClose } = useContext(NavbarContext);

    const appealsFromServer: Array<IAppeals> = [
        {id: 10003, date: '24.03.2022', title: 'Название жалобы', description: 'Длиииинный текст', shortDescription: 'Короткое описание', status: Status.waitingForAction},
        {id: 10002, date: '12.03.2022', title: 'Название жалобы', description: 'Длиииинный текст', shortDescription: 'Короткое описание', status: Status.inProcess},
        {id: 10001, date: '02.03.2022', title: 'Название жалобы', description: 'Длиииинный текст', shortDescription: 'Короткое описание', status: Status.sent},
        {id: 10000, date: '01.03.2022', title: 'Название жалобы', description: 'Длиииинный текст', shortDescription: 'Короткое описание', status: Status.verification},
        {id: 10004, date: '01.03.2022', title: 'Название жалобы', description: 'Длиииинный текст', shortDescription: 'Короткое описание', status: Status.success},
        {id: 10005, date: '01.03.2022', title: 'Название жалобы', description: 'Длиииинный текст', shortDescription: 'Короткое описание', status: Status.success}
    ]

    const notificationsFromServer: Array<INotifications> = [
        {id: 10001, sentTime: '2 мин назад', title: NotificationsTitle.sent, isRead: false},
        {id: 10002, sentTime: '5 мин назад', title: NotificationsTitle.success, isRead: false},
        {id: 10003, sentTime: '30 мин назад', title: NotificationsTitle.newStatus, isRead: false},
        {id: 10004, sentTime: '1 ч назад', title: NotificationsTitle.newStatus, isRead: true},
        {id: 10005, sentTime: '2 ч назад', title: NotificationsTitle.sent, isRead: true},
    ]

    return (
        <MainWrapper>
            <div className={classNames(styles.home_content, isNavbarClose && styles.width)}>
                <div className={styles.appeals}>
                    <div className={styles.main_caption}>Обращения</div>
                    <Claims claims={appealsFromServer} />
                </div>
                <RightSideBar notifications={notificationsFromServer}/>
            </div>
        </MainWrapper>
    );
}

export default MainPage;