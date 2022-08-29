import React, {FC, useState} from "react";
import NavbarContext from "../context/NavbarContext";

const NavbarDataLayer: FC = ({children}) => {

    const [isNavbarClose, setIsNavbarClose] = useState(true);

    return (
        <NavbarContext.Provider value={{isNavbarClose, setIsNavbarClose}}>
            {children}
        </NavbarContext.Provider>
    )
}

export default NavbarDataLayer;