import React from "react";
import styles from "./UseCasesPage.module.sass";

const UseCasesPage = () => {
    return (
        <div className={styles['page-body']}>
            <div className={styles['greetings-section']}>
                <div className={styles['content-container']}>
                    <div>тут будут возможности нашего сервиса</div>
                    <div>а пока пусто :D</div>
                </div>
            </div>
        </div>
    )
}

export default UseCasesPage