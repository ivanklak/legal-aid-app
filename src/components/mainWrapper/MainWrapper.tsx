import React, {FC} from "react";
import styles from "./MainWrapper.module.css";

const MainWrapper: FC = ({children}) => {
    return (
        <main className={styles.main_wrapper}>
            <div className={styles.wrapper_content}>
                {children}
            </div>
        </main>
    )
}

export default MainWrapper;