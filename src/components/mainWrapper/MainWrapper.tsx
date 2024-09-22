import React, {memo} from "react";
import styles from "./MainWrapper.module.sass";

interface MainWrapperProps {
    children: React.ReactNode
}

const MainWrapper = memo<MainWrapperProps>(({children}) => {
    return (
        <main className={styles['main-wrapper']}>
            <div className={styles['wrapper-content']}>
                {children}
            </div>
        </main>
    )
})

export default MainWrapper;