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
            {id: '', role: UserRole.client, email: 'test@test.com'},
            {id: '', role: UserRole.client, email: 'optimus@test.com'},
        ],
        partners: [
            {id: '', role: UserRole.partner, email: 'yandex@test.com'},
            {id: '', role: UserRole.partner, email: 'sber@test.com'},
        ],
        lawyers: [
            {id: '', role: UserRole.lawyer, email: 'lawyer1@test.com'},
            {id: '', role: UserRole.lawyer, email: 'lawyer2@test.com'},
        ],
        admins: [
            {id: '', role: UserRole.admin, email: 'admin1@test.com'},
            {id: '', role: UserRole.admin, email: 'admin2@test.com'},
        ]
    }
}