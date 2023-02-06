import React from "react";
import MainWrapper from "../mainWrapper/MainWrapper";
import styles from "./MyRequests.module.css";

const MyRequests = () => {
    return (
        <MainWrapper>
            <div className={styles.my_requests}>
                <h1>My Requests</h1>
            </div>
        </MainWrapper>
    );
}

export default MyRequests;