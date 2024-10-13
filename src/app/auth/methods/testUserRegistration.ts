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

        const newUserData1: TRegistrationPayload & {integrationId: string} = {
            id: String(Math.floor(1000 + Math.random() * 9000)),
            role: UserRole.partner,
            name: 'Яндекс маркет',
            email: 'yandex@test.com',
            password: 'qwerty90',
            agreementCheckbox: true,
            integrationId: 'y4nd3x-p4r1n3r-1d'
        }

        const newUserData0: TRegistrationPayload & {integrationId: string} = {
            id: String(Math.floor(1000 + Math.random() * 9000)),
            role: UserRole.partner,
            name: 'Сбер',
            email: 'sber@test.com',
            password: 'qwerty90',
            agreementCheckbox: true,
            integrationId: 's6er-p4r1n3r-1d'
        }

        const newUserData2: TRegistrationPayload = {
            id: String(Math.floor(1000 + Math.random() * 9000)),
            role: UserRole.lawyer,
            name: 'Агент Сеймур Симонс',
            email: 'lawyer1@test.com',
            password: 'qwerty90',
            agreementCheckbox: true
        }

        const newUserData3: TRegistrationPayload = {
            id: String(Math.floor(1000 + Math.random() * 9000)),
            role: UserRole.lawyer,
            name: 'Бамблби',
            email: 'lawyer2@test.com',
            password: 'qwerty90',
            agreementCheckbox: true
        }

        const newUserData4: TRegistrationPayload = {
            id: String(Math.floor(1000 + Math.random() * 9000)),
            role: UserRole.admin,
            name: 'Сэм Уиткики',
            email: 'admin1@test.com',
            password: 'qwerty90',
            agreementCheckbox: true
        }

        const newUserData5: TRegistrationPayload = {
            id: String(Math.floor(1000 + Math.random() * 9000)),
            role: UserRole.admin,
            name: 'Микаэла Бейнс',
            email: 'admin2@test.com',
            password: 'qwerty90',
            agreementCheckbox: true
        }

        existedUsersArray.push(...[newUserData0, newUserData1, newUserData2, newUserData3, newUserData4, newUserData5]);

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