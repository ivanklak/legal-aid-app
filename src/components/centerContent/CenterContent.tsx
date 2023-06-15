import React, {memo, useEffect, useRef, useState} from "react";
import styles from "./CenterContent.module.sass";
import classNames from "classnames";

interface CenterContentProps {
    className?: string;
    children: React.ReactNode;
}

const CenterContent = memo<CenterContentProps>(({children, className}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [centerContent, setCenterContent] = useState<boolean>(false);
    const [isReady, setIsReady] = useState<boolean>(false);

    useEffect(() => {
        if (ref.current) {
            if (ref.current.clientWidth >= 1700) {
                setCenterContent(true);
                setIsReady(true);
            } else {
                setCenterContent(false);
                setIsReady(true);
            }
        } else {
            setIsReady(false);
        }
    }, [ref])

    return (
        <div
            ref={ref}
            className={classNames(
                className,
                styles.content,
                centerContent && styles.center_content
            )}
        >
            {isReady && children}
        </div>
    )
})

export default CenterContent