import React, {FC} from "react";
import styles from "./ContentBody.module.sass";

interface ContentBodyProps {
    children: React.ReactNode
}

const ContentBody: FC<ContentBodyProps> = ({children}) => {
    return (
        <div className={styles['content-body']}>
            <div className={styles['inner-container']}>
                {children}
            </div>
        </div>
    )
}

export default ContentBody;