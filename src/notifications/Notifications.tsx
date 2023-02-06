import React, {FC} from "react";
import MainWrapper from "../components/mainWrapper/MainWrapper";
import styles from "./Notifications.module.css";

const Notifications: FC = () => {
    return (
        <MainWrapper>
            <div className={styles.notifications}>
                <h1>Notifications</h1>
            </div>
        </MainWrapper>
    )
}

export default Notifications;