import React from "react";
import MainWrapper from "../mainWrapper/MainWrapper";
import styles from "./NewRequest.module.css";

const NewRequests = () => {
    return (
        <MainWrapper>
            <div className={styles.new_request}>
                <h1>New Request</h1>
            </div>
        </MainWrapper>
    );
}

export default NewRequests;