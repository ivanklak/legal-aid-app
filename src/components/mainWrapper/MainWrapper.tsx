import React, {FC, useContext} from "react";
import styles from "./MainWrapper.module.css";
import NavbarContext from "../../App/context/NavbarContext";
import classNames from "classnames";

const MainWrapper: FC = ({children}) => {
    const { isNavbarClose } = useContext(NavbarContext);

    return (
        <div
            className={classNames(
                styles.main_wrapper,
                !isNavbarClose && styles.squeeze
            )}
        >
            {children}
        </div>
    )
}

export default MainWrapper;