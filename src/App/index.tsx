import React, {FC, useState} from "react";
import styles from "./App.module.css";
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
        <div className={styles.wrapper}>
            <AuthProvider>
                <NavbarDataLayer>
                    <AppRoutes />
                </NavbarDataLayer>
            </AuthProvider>
        </div>
    )
}

export default App;