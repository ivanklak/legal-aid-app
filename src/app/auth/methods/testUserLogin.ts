import {IUserData} from "../../../pages/loginPages/api/AuthServise";

export interface ILoginParams {
    email: string;
    password: string;
}

export interface IUserLoginResponse extends IUserData {}

const TIMEOUT = 1500;

export const testUserLogin = (params: ILoginParams, timeout?: number): Promise<IUserLoginResponse> => {
    return new Promise((resolve, reject) => {
        if (!params) {
            reject();
            return;
        }

        window.setTimeout(() => {
            const existedUsersString = localStorage.getItem('reg_users');

            let existedUsersArray: IUserLoginResponse[] = [];

            try {
                if (existedUsersString) {
                    const parsedRegUsers: IUserLoginResponse[] = JSON.parse(existedUsersString) || [];

                    if (parsedRegUsers?.length) {
                        existedUsersArray.push(...parsedRegUsers);
                    }
                }
            } catch (e) {
                console.error('Cannot parse reg_users in LoginForm -> existedUsersString', existedUsersString);
            }

            if (!existedUsersArray.length) {
                resolve(null);
            } else {
                const reqUserData: IUserLoginResponse = existedUsersArray.find((data) => data.email === params.email);

                if (!reqUserData) {
                    resolve(null);
                } else {
                    if (reqUserData.password === params.password) {
                        resolve(reqUserData);
                    } else {
                        resolve(null);
                    }
                }
            }
        }, timeout ? timeout : TIMEOUT)
    })
}