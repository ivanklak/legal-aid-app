import React from "react";
import NotAuthHeader from "../../components/header/notAuthHeader/NotAuthHeader";
import styles from "./UseCasesPage.module.sass";

const UseCasesPage = () => {
    return (
        <>
            <NotAuthHeader />
            <div className={styles['page-body']}>
                <div className={styles['greetings-section']}>
                    <div className={styles['content-container']}>
                        <div>тут будут возможности нашего сервиса</div>
                        <div>а пока пусто :D</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default UseCasesPage