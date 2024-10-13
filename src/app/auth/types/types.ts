import {IUserData} from "../../../pages/loginPages/api/AuthServise";

export enum UserRole {
    client = 'client',
    partner = 'partner',
    lawyer = 'lawyer',
    admin = 'admin'
}

export interface IUser {
    id: string;
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
    integrationId: string; // для партнерства
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

export const isClient = (user: IUserData): user is IUserClient => {
    return user.role === UserRole.client;
}

export const isPartner = (user: IUserData): user is IUserPartner => {
    return user.role === UserRole.partner;
}

export const isLawyer = (user: IUserData): user is IUserLawyer => {
    return user.role === UserRole.lawyer;
}

export const isAdmin = (user: IUserData): user is IUserAdmin => {
    return user.role === UserRole.admin;
}