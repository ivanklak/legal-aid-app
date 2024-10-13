import {TRegistrationPayload} from "./testUserRegistration";
import {IUserData} from "../../../pages/loginPages/api/AuthServise";

export interface IUserRestoreResponse extends IUserData {}

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
                    resolve(reqUserData);
                }, 500)
            }
        }
    })
}