import React, {FC} from "react";
import styles from "./RightSideBar.module.css";
import NavigatedSearchBar from "../search/SearchBar";
import {INotifications} from "../mainPage/MainPage";
import NotificationItem from "../notificationItem";
import {useNavigate} from "react-router-dom";
import {BsPlusSquareDotted} from "react-icons/bs";

interface RightSideBarProps {
    notifications: Array<INotifications>
}

const RightSideBar: FC<RightSideBarProps> = ({notifications}) => {
    const navigate = useNavigate();

    const onAllNotificationsClick = () => {
        navigate('/notifications')
    }

    const onListClick = () => {
        navigate('/category')
    }

    const onCreateClick = () => {
        navigate('/newRequest')
    }

    return (
        <div className={styles.right_side_bar}>
            <div className={styles.search_block}>
                <NavigatedSearchBar />
            </div>
            <div className={styles.caption}>Уведомления</div>
            <div className={styles.notifications}>
                <div>
                    {notifications.map((item) => (
                        <NotificationItem
                            isRead={item.isRead}
                            item={item}
                            key={item.id}
                        />
                    ))}
                </div>
                <div className={styles.allNotifications} onClick={onAllNotificationsClick}>
                    Все уведомления
                </div>
            </div>
            <div className={styles.create_new}>
                <div className={styles.button_container} onClick={onCreateClick}>
                    <div className={styles.create_button}>
                        <div className={styles.create_icon}>
                            <BsPlusSquareDotted size="25" color="var(--base-color__white)" />
                        </div>
                    </div>
                </div>
                <div className={styles.create_text}>
                    <div className={styles.create_caption}>Новое обращение</div>
                    <div className={styles.create_notice}>или выберете категорию и учреждение из <span className={styles.list} onClick={onListClick}>списка</span></div>
                </div>
            </div>
        </div>
    )
}

export default RightSideBar;