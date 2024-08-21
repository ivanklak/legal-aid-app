import React, {FC} from "react";
import styles from "./App.module.css";
import AppRoutes from "./routes";
import {AuthProvider} from "./Layers/AuthProvider";
import NavbarDataLayer from "./Layers/NavbarDataLayer";
import {ConfigProvider} from "antd";

enum Roles {
    User = "USER",
    Editor = "EDITOR",
    Admin = "ADMIN"
}

const App: FC = () => {

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: 'rgb(100, 78, 215)',
                },
            }}
        >
            <div className={styles.wrapper}>
                {/*<div className={styles.bgImage}></div>*/}
                <AuthProvider>
                    <NavbarDataLayer>
                        <AppRoutes />
                    </NavbarDataLayer>
                </AuthProvider>
            </div>
        </ConfigProvider>
    )
}

export default App;