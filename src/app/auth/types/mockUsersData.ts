import {IUser, UserRole} from "./types";

export interface IMockUsersData {
    users: {
        clients: IUser[],
        partners: IUser[],
        lawyers: IUser[],
        admins: IUser[]
    };
}

export const mockUsersData: IMockUsersData = {
    users: {
        clients: [
            {role: UserRole.client, email: 'test@test.com'},
            {role: UserRole.client, email: 'optimus@test.com'},
        ],
        partners: [
            {role: UserRole.partner, email: 'yandex@test.com'},
            {role: UserRole.partner, email: 'sber@test.com'},
        ],
        lawyers: [
            {role: UserRole.lawyer, email: 'lawyer1@test.com'},
            {role: UserRole.lawyer, email: 'lawyer2@test.com'},
        ],
        admins: [
            {role: UserRole.admin, email: 'admin1@test.com'},
            {role: UserRole.admin, email: 'admin2@test.com'},
        ]
    }
}