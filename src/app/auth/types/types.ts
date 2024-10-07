export enum UserRole {
    client = 'client',
    partner = 'partner',
    lawyer = 'lawyer',
    admin = 'admin'
}

export interface IUser {
    role: UserRole;
    email: string;
}

export interface IUserClient extends IUser {
    role: UserRole.client;
    name: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    dateOfBirth: string;
}

export interface IUserPartner extends IUser {
    role: UserRole.partner;
    companyName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    taxId: string;
}

export interface IUserLawyer extends IUser {
    role: UserRole.lawyer;
    name: string;
    email: string;
    password: string;
    phone: string;
    licenseNumber: string;
    specialization: string;
}

export interface IUserAdmin extends IUser {
    role: UserRole.admin;
    name: string;
    email: string;
    password: string;
}