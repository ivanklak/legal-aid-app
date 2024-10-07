import {UserRole} from "../types/types";
import {TRegistrationPayload} from "./testUserRegistration";

export interface ILoginParams {
    email: string;
    password: string;
}

export type TLoginPayload = TRegistrationPayload;

export interface IUserLoginResponse {
    id: string;
    role: UserRole,
    name: string;
    email: string;
}

const TIMEOUT = 1500;

export const testUserLogin = (params: ILoginParams, timeout?: number): Promise<IUserLoginResponse> => {
    return new Promise((resolve, reject) => {
        if (!params) {
            reject();
            return;
        }

        window.setTimeout(() => {
            const existedUsersString = localStorage.getItem('reg_users');

            let existedUsersArray: TLoginPayload[] = [];

            try {
                if (existedUsersString) {
                    const parsedRegUsers: TLoginPayload[] = JSON.parse(existedUsersString) || [];

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
                const reqUserData: TLoginPayload = existedUsersArray.find((data) => data.email === params.email);

                if (!reqUserData) {
                    resolve(null);
                } else {
                    if (reqUserData.password === params.password) {
                        resolve({
                            id: reqUserData.id,
                            role: reqUserData.role,
                            name: reqUserData.name,
                            email: reqUserData.email
                        });
                    } else {
                        resolve(null);
                    }
                }
            }
        }, timeout ? timeout : TIMEOUT)
    })
}