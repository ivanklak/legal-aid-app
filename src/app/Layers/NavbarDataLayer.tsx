import React, {memo, useState} from "react";
import NavbarContext from "../context/NavbarContext";

interface NavbarDataLayerProps {
    children: React.ReactNode
}

const NavbarDataLayer = memo<NavbarDataLayerProps>(({children}) => {

    const [isNavbarClose, setIsNavbarClose] = useState(false);

    return (
        <NavbarContext.Provider value={{isNavbarClose, setIsNavbarClose}}>
            {children}
        </NavbarContext.Provider>
    )
})

export default NavbarDataLayer;