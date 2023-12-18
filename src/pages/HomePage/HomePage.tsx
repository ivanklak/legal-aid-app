import React, {memo} from "react";
import styles from "./HomePage.module.sass";

interface HomePageProps {}

const HomePage = memo<HomePageProps>(() => {
    return (
        <div className={styles['home-page']}>
            home page
        </div>
    )
})

export default HomePage;