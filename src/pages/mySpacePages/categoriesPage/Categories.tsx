import React from "react";
import MainWrapper from "../../../components/mainWrapper/MainWrapper";
import styles from "./Categories.module.sass";

const Categories = () => {
    return (
        <MainWrapper>
            <div className={styles['categories']}>
                <h1>Categories</h1>
            </div>
        </MainWrapper>
    )
}

export default Categories;