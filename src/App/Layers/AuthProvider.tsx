import React, {createContext, FC, useEffect, useState} from "react";
import {AuthService, IAuthData, IUserData} from "../../login/api/AuthServise";
import {useNavigate} from "react-router-dom";

export interface IAuthContext {
    isAuth: boolean;
    authData: IAuthData;
    userData: IUserData;
    isAuthInProgress: boolean;
    setIsAuth: (isAuth: boolean) => void;
    setAuthData: (auth: IAuthData) => void;
    setIsAuthInProgress: (value: boolean) => void;
    setUserData: (userData: IUserData) => void;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: FC = ({ children }) => {
    const navigate = useNavigate();
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [authData, setAuthData] = useState<IAuthData>(null);
    const [userData, setUserData] = useState<IUserData>(null);
    const [isAuthInProgress, setIsAuthInProgress] = useState<boolean>(false);

    useEffect(() => {
        checkAuth();
    }, [])

    const checkAuth = async () => {
        setIsAuthInProgress(true);
        const token = localStorage.getItem('token');
        if (!!token) {
            await requestGetInfo();
        } else {
            console.log('no token ==> go to login');
            navigate('/login');
        }
    }

    const requestGetInfo = async () => {
        try {
            const response = await AuthService.getInfo();
            if (response) {
                console.log('getInfo response', response)
                setUserData(response.data.user);
                setAuthData({
                    id: response.data.sessionId,
                });
                setIsAuth(true);
                setIsAuthInProgress(false);
            }
        } catch (error) {
            console.log('requestGetInfo error', error)
            refreshToken();
        }
    }

    const refreshToken = async () => {
        try {
            const response = await AuthService.refreshToken();
            if (response) {
                localStorage.setItem("refreshToken token", response.data.accessToken);
                setAuthData({
                    id: localStorage.getItem('id'),
                    access_token: response.data.accessToken,
                    refresh_token: response.data.refreshToken
                });
            }
        } catch (err) {
            console.log("refreshToken error", err);
            setIsAuthInProgress(false);
        } finally {
            setIsAuthInProgress(false);
        }
    }


    return (
        <AuthContext.Provider
            value={{
                isAuth,
                authData,
                userData,
                isAuthInProgress,
                setIsAuth,
                setAuthData,
                setIsAuthInProgress,
                setUserData
             }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;