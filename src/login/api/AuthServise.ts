import {instance} from "../../api.config";

interface ILoginResponse {
    access_token: string;
    id: string;
    refresh_token: string;
    role: string;
}

interface IAuthService {
    login: (email: string, password: string) => Promise<ILoginResponse>;
    refreshToken: () => Promise<ILoginResponse>;
    logout: () => any;
}


export const AuthService: IAuthService = {

    login: (email, password) => {
        return instance.post("/auth/login", {email, password})
    },

    refreshToken: () => {
        return instance.get("/auth/refresh");
    },

    logout: () => {
        return instance.post("/auth/logout")
    }
};