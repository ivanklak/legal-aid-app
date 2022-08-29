import React, {FC, useState} from "react";
import AppRoutes from "./routes";
import {AuthProvider} from "./Layers/AuthProvider";
import NavbarDataLayer from "./Layers/NavbarDataLayer";

enum Roles {
    User = "USER",
    Editor = "EDITOR",
    Admin = "ADMIN"
}

const App: FC = () => {

    return (
        <AuthProvider>
            <NavbarDataLayer>
                <AppRoutes />
            </NavbarDataLayer>
        </AuthProvider>
    )
}

export default App;