import {TRegistrationPayload} from "./testUserRegistration";
import {UserRole} from "../types/types";

export interface IUserRestoreResponse {
    id: string;
    role: UserRole,
    name: string;
    email: string;
}

export const testRestoreUserSession = (): Promise<IUserRestoreResponse> => {
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
                window.setTimeout(() =>  {
                    resolve({
                        id: reqUserData.id,
                        role: reqUserData.role,
                        name: reqUserData.name,
                        email: reqUserData.email
                    });
                }, 500)
            }
        }
    })
}