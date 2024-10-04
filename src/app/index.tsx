import React, {FC} from "react";
import {AuthProvider} from "./Layers/AuthProvider";
import {ConfigProvider} from "antd";
import {HashRouter} from "react-router-dom";
import Header from "../components/header/Header";
import AppRoutes from "./routing/AppRoutes";

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
            <HashRouter>
                <AuthProvider>
                    <Header />
                    <AppRoutes />
                </AuthProvider>
            </HashRouter>
        </ConfigProvider>
    )
}

export default App;