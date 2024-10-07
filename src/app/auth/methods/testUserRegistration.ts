import {UserRole} from "../types/types";

export interface CreateAccountParams {
    name: string;
    email: string;
    password: string;
    agreementCheckbox: boolean;
}

export interface IExtraUserPayload {
    id: string;
    role: UserRole;
}

export type TRegistrationPayload = IExtraUserPayload & CreateAccountParams;

export interface IUserRegistrationResponse {
    id: string;
    role: UserRole,
    name: string;
    email: string;
}

const TIMEOUT = 1500;

export const testUserRegistration = (payload: CreateAccountParams, timout?: number): Promise<IUserRegistrationResponse> => {
    return new Promise((resolve, reject) => {
        if (!payload || (payload && !payload.agreementCheckbox)) {
            reject();
            return;
        }

        // 4 digit number
        const testNewUserId = String(Math.floor(1000 + Math.random() * 9000));

        const newUserData: TRegistrationPayload = {
            ...payload,
            id: testNewUserId,
            role: UserRole.client
        }

        const existedUsersString = localStorage.getItem('reg_users');

        let existedUsersArray: TRegistrationPayload[] = [];

        try {
            if (existedUsersString) {
                const parsedRegUsers: TRegistrationPayload[] = JSON.parse(existedUsersString) || [];

                if (parsedRegUsers?.length) {
                    existedUsersArray.push(...parsedRegUsers);
                }
            }
        } catch (e) {
            console.error('Cannot parse reg_users in RegistrationForm -> existedUsersString', existedUsersString);
        }

        existedUsersArray.push(newUserData);

        const usersToSave = JSON.stringify(existedUsersArray);

        localStorage.setItem('reg_users', usersToSave);
        localStorage.setItem('last_id', testNewUserId);

        const response: IUserRegistrationResponse = {
            id: newUserData.id,
            name: newUserData.name,
            email: newUserData.email,
            role: newUserData.role
        }

        window.setTimeout(() => {
            resolve(response)
        }, timout ? timout : TIMEOUT)
    })
}