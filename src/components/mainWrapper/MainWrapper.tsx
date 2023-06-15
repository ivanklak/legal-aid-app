import React, {FC, useContext, useEffect, useRef, useState} from "react";
import styles from "./MainWrapper.module.css";
import NavbarContext from "../../App/context/NavbarContext";
import classNames from "classnames";

const MainWrapper: FC = ({children}) => {
    const ref = useRef<HTMLDivElement>(null);
    const { isNavbarClose } = useContext(NavbarContext);
    const [centerContent, setCenterContent] = useState<boolean>(false);


    useEffect(() => {
        if (ref.current) {
            if (ref.current.clientWidth >= 1700) {
                setCenterContent(true);
            } else {
                setCenterContent(false);
            }
        }
    }, [])

    return (
        <div
            ref={ref}
            className={classNames(
                styles.main_wrapper,
                !isNavbarClose && styles.squeeze,
                centerContent && styles.center_content
            )}
        >
            {children}
        </div>
    )
}

export default MainWrapper;