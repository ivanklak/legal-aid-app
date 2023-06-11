import React, {FC} from "react";
import styles from "./ContentBody.module.css";

interface ContentBodyProps {
    children: React.ReactNode
}

const ContentBody: FC<ContentBodyProps> = ({children}) => <div className={styles.contentBody}>{children}</div>

export default ContentBody;