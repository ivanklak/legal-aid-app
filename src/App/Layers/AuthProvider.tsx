import React, {createContext, FC, useEffect, useState} from "react";
import {AuthService, IAuthData, IUserData} from "../../login/api/AuthServise";
import {useLocation, useNavigate} from "react-router-dom";
import {requestInfo} from "../../login/api/methods/requestInfo";
import {
    TRegistrationPayload
} from "../../newRequest/newRequestForm/components/newRequestRegistrationForm/NewRequestRegistrationForm";

export interface IAuthContext {
    isAuth: boolean;
    authData: IAuthData;
    userData: IUserData;
    isAuthInProgress: boolean;
    setIsAuth: (isAuth: boolean) => void;
    setAuthData: (auth: IAuthData) => void;
    setIsAuthInProgress: (value: boolean) => void;
    setUserData: (userData: IUserData) => void;
    //
    requestGetInfo: () => Promise<void>;
}

export const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider: FC = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [authData, setAuthData] = useState<IAuthData>(null);
    const [userData, setUserData] = useState<IUserData>(null);
    const [isAuthInProgress, setIsAuthInProgress] = useState<boolean>(true);

    useEffect(() => {
        // checkAuth();
        testCheckAuth();
    }, [])

    const checkAuth = async () => {
        setIsAuthInProgress(true);
        const token = localStorage.getItem('token');
        if (!!token) {
            await requestGetInfo();
        } else {
            console.log('no token ==> go to login');
            location.pathname !== '/' && navigate('/login');
            setIsAuthInProgress(false);
        }
    }

    const testCheckAuth = () => {
        setIsAuthInProgress(true);

        restoreUserSession()
            .then((data: TRegistrationPayload) => {
                if (!data) {
                    setIsAuth(false);
                    console.log('не получилось восстановить сессию')
                } else {
                    setIsAuth(true);
                    setUserData({
                        firstName: data.name,
                        lastLame: data.lastName,
                        patronymic: '', // отчество что ли ?
                        id: Number(data.id),
                        email: data.email,
                        phone: '',
                        address: data.address,
                        inn: data.inn,
                        status: '',
                        passNumber: data.passNumber
                    });
                    console.log('=== сессия успешно восстановлена ===')
                }
                setIsAuthInProgress(false);
            })
            .catch(() => {
                console.log('error, нет lastUserId или existedUsers')
                setIsAuthInProgress(false);
            })
    }

    const restoreUserSession = (): Promise<TRegistrationPayload> => {
        return new Promise((resolve, reject) => {
            const lastUserId = localStorage.getItem('last_id');
            const existedUsersString = localStorage.getItem('reg_users');

            if (!lastUserId || !existedUsersString) {
                reject(null);
                return;
            }

            let existedUsersArray: TRegistrationPayload[] = [];

            try {
                if (existedUsersString) {
                    const parsedRegUsers: TRegistrationPayload[] = JSON.parse(existedUsersString) || [];

                    if (parsedRegUsers?.length) {
                        existedUsersArray.push(...parsedRegUsers);
                    }
                }
            } catch (e) {
                console.error('Cannot parse reg_users in AuthProvider -> existedUsersString', existedUsersString);
            }

            if (!existedUsersArray.length) {
                resolve(null);
            } else {
                const reqUserData: TRegistrationPayload = existedUsersArray.find((data) => data.id === lastUserId);

                if (!reqUserData) {
                    resolve(null);
                } else {
                    window.setTimeout(() =>  resolve(reqUserData), 500)
                }
            }
        })
    }

    const requestGetInfo = async () => {
        try {
            const sessionId = localStorage.getItem('id');
            const email = userData?.email ?? localStorage.getItem('email');
            const response = await requestInfo(sessionId, email);
            if (response) {
                console.log('getInfo response', response)
                setUserData(response.user);
                setAuthData({ sessionId: response.sessionId });
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
                    sessionId: localStorage.getItem('id'),
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
                setUserData,
                requestGetInfo
             }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;