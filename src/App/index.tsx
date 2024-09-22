import React, {FC} from "react";
import styles from "./App.module.sass";
import AppRoutes from "./routes";
import {AuthProvider} from "./Layers/AuthProvider";
import {ConfigProvider} from "antd";
import {HashRouter} from "react-router-dom";
import NotAuthHeader from "../components/header/notAuthHeader/NotAuthHeader";

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
            <div className={styles['wrapper']}>
                <HashRouter>
                    <AuthProvider>
                        <NotAuthHeader />
                        <AppRoutes />
                    </AuthProvider>
                </HashRouter>
            </div>
        </ConfigProvider>
    )
}

export default App;