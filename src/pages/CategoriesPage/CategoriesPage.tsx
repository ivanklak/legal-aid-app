import React from "react";
import NotAuthHeader from "../../components/header/notAuthHeader/NotAuthHeader";
import styles from "./CategoriesPage.module.sass";

const CategoriesPage = () => {
    return (
        <>
            <NotAuthHeader />
            <div className={styles['page-body']}>
                <div className={styles['greetings-section']}>
                    <div className={styles['content-container']}>
                        <div>тут будут категории хрен знает чего</div>
                        <div>а пока пусто :D</div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CategoriesPage