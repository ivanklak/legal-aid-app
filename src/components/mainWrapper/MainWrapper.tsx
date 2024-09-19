import React, {FC} from "react";
import styles from "./MainWrapper.module.sass";

const MainWrapper: FC = ({children}) => {
    return (
        <main className={styles['main-wrapper']}>
            <div className={styles['wrapper-content']}>
                {children}
            </div>
        </main>
    )
}

export default MainWrapper;