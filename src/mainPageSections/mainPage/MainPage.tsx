import React, {FC, useContext} from "react";
import styles from "./MainPage.module.css";
import NavbarContext from "../../App/context/NavbarContext";
import MainWrapper from "../../components/mainWrapper/MainWrapper";
import Claims from "../claims/Claims";
import RightSideBar from "../rightSideBar/RightSideBar";
import CenterContent from "../../components/centerContent/CenterContent";
import AuthContext from "../../App/Layers/AuthProvider";
import NoAuthorized from "../../components/noAuthorized/NoAuthorized";

export enum Status {
    success = "Решено",
    inProcess = "В процессе",
    sent = "Отправлено",
    verification = "Верификация",
    waitingForAction = 'Требудется действие'
}

export enum StatusV2 {
    resolved = "RESOLVED",
    new = "NEW",
    decline = "DECLINE",
    inProcess = "IN_PROCESS",
    waitingForAction = 'WAIT_FOR_ACTION'
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
    const { isAuth } = useContext(AuthContext);

    const notificationsFromServer: Array<INotifications> = [
        {id: 10001, sentTime: '2 мин назад', title: NotificationsTitle.sent, isRead: false},
        {id: 10002, sentTime: '5 мин назад', title: NotificationsTitle.success, isRead: false},
        {id: 10003, sentTime: '30 мин назад', title: NotificationsTitle.newStatus, isRead: false},
        {id: 10004, sentTime: '1 ч назад', title: NotificationsTitle.newStatus, isRead: true},
        {id: 10005, sentTime: '2 ч назад', title: NotificationsTitle.sent, isRead: true},
    ]

    return (
        <MainWrapper>
            <CenterContent>
                <div className={styles.appeals}>
                    <div className={styles.main_caption}>Обращения</div>
                    {/*<Claims />*/}
                    {isAuth ? (
                        <Claims />
                    ) : (
                        <NoAuthorized />
                    )}
                </div>
                <RightSideBar notifications={notificationsFromServer}/>
            </CenterContent>
        </MainWrapper>
    );
}

export default MainPage;