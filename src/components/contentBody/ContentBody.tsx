import React, {FC} from "react";
import styles from "./ContentBody.module.sass";

interface ContentBodyProps {
    children: React.ReactNode
}

const ContentBody: FC<ContentBodyProps> = ({children}) => <div className={styles['content-body']}>{children}</div>

export default ContentBody;