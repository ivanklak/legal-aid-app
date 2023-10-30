import {instance} from "../../api.config";
import {AxiosResponse} from "axios";

export interface IAuthData {
    sessionId: string;
    role?: string,
    access_token?: string,
    refresh_token?: string,
    errorCode?: number,
}

export interface IInfoResponse {
    sessionId: string;
    user: IUserData;
}

export interface IUserData {
    firstName: string;
    lastLame: string;
    patronymic: string;
    email: string;
    phone: string;
    address: string;
    inn: string;
    status: string;
}

export interface IRefreshData {
    accessToken: string;
    refreshToken: string;
}

interface IAuthService {
    login: (email: string, password: string) => Promise<AxiosResponse<IAuthData>>;
    refreshToken: () =>  Promise<AxiosResponse<IRefreshData>>;
    logout: () => Promise<AxiosResponse<any>>;
    getInfo: () => Promise<AxiosResponse<IInfoResponse>>
}


export const AuthService: IAuthService = {

    // not used
    login: (email, password) => {
        return instance.post("/auth/login", {email, password})
    },

    refreshToken: () => {
        return instance.post("/auth/refresh");
    },

    logout: () => {
        return instance.post("/auth/logout")
    },

    // not used
    getInfo: () => {
        return instance.post("/info")
    }
};