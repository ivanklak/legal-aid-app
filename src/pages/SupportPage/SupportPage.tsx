import React from "react";
import NotAuthHeader from "../../components/header/notAuthHeader/NotAuthHeader";
import styles from "./SupportPage.module.sass";

const SupportPage = () => {
    return (
        <>
            <NotAuthHeader />
            <div className={styles['page-body']}>
                <div className={styles['greetings-section']}>
                    <div className={styles['content-container']}>
                        <div>тут будет поддержка наших дорогих клиентов</div>
                        <div>ипать их в жопу :D</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SupportPage