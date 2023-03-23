import React, {FC, useState} from "react";
import styles from "./HelpLink.module.css";
import { IoIosArrowForward } from "react-icons/io";
import classNames from "classnames";

interface HelpLinkProps {
    text: string
    description: string
    className?: string
}

const HelpLink: FC<HelpLinkProps> = ({text, description, className}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const clickHandle = () => {
        setIsOpen(!isOpen)
    }

    return (
        <>
            <div
                className={classNames(
                    styles.link_container,
                    className
                )}
                onClick={clickHandle}
            >
                <div className={styles.icon_container}>
                    <i
                        className={classNames(
                            styles.icon,
                            isOpen && styles.touched
                        )}
                    >
                        <IoIosArrowForward/>
                    </i>
                </div>
                <div className={styles.link_text}>
                    {text}
                </div>
            </div>
            <div className={classNames(
                styles.description,
                isOpen && styles.active
            )}>
                {description}
            </div>
        </>
    )
}

export default HelpLink;