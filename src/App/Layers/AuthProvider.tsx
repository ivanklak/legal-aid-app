import React, {createContext, FC, useEffect, useState} from "react";
import {AuthService} from "../../login/api/AuthServise";

export interface IAuthContext {
    auth: IAuth;
    isAuthInProgress: boolean;
    setAuth: (auth: IAuth) => void;
    setIsAuthInProgress: (value: boolean) => void;
}

export interface IAuth {
    email: string;
    pwd: string;
    roles: string,
    accessToken: string,
    refreshToken: string
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: FC = ({ children }) => {
    const [auth, setAuth] = useState<IAuth | undefined>();
    const [isAuthInProgress, setIsAuthInProgress] = useState<boolean>(false);

    useEffect(() => {
        checkAuth();
    }, [])

    const checkAuth = async () => {
        setIsAuthInProgress(true);
        try {
            // TODO обновление токена
            const response = await AuthService.refreshToken();
            localStorage.setItem("token", response.access_token);
        } catch (err) {
            console.log("login error");
            setIsAuthInProgress(false);
        } finally {
            setIsAuthInProgress(false);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                isAuthInProgress,
                setAuth,
                setIsAuthInProgress
             }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;