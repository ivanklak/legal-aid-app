import React, {memo, useMemo, useState} from "react";
import styles from "./NewRequestRegistrationForm.module.sass";
import {Input, InputSize} from "../../../../designSystem/input";
import Button from "../../../../designSystem/button/Button";
import {useAuth} from "../../../../app/hooks/useAuth";
import {LoaderCircle} from "../../../../designSystem/loader/Loader.Circle";

type TRegPageId = 'credentials' | 'addUserData';

type TUserDataToSend = {
    name: string;
    lastName: string;
    email: string;
    password: string;
    inn: string;
    address: string;
    passNumber: string;
}

export type TRegistrationPayload = {id: string} & TUserDataToSend

interface NewRequestRegistrationFormProps {}

const NewRequestRegistrationForm = memo<NewRequestRegistrationFormProps>(({}) => {
    const {setIsAuth, setUserData} = useAuth();
    // pages
    const [pageId, setPageId] = useState<TRegPageId>('credentials');
    // credentials - page
    const [name, setName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    // addUserData - page
    const [inn, setInn] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [passNumber, setPassNumber] = useState<string>('');

    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);


    const handleNameChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        setName(value);
    }
    const handleLastNameChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(value);
    }

    const handleEmailChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(value);
    }

    const handlePasswordChange = (value: string) => {
        setPassword(value);
    }

    const handleInnChange = (value: string) => {
        setInn(value);
    }

    const handleAddressChange = (value: string) => {
        setAddress(value);
    }

    const handlePassNumberChange = (value: string) => {
        setPassNumber(value);
    }

    const handleNameClear = () => {
        setName('');
        setError('');
    }

    const handleLastNameClear = () => {
        setLastName('');
        setError('');
    }

    const handleEmailClear = () => {
        setEmail('');
        setError('');
    }

    const handlePasswordClear = () => {
        setPassword('');
        setError('');
    }

    const handleInnClear = () => {
        setInn('');
        setError('');
    }

    const handleAddressClear = () => {
        setAddress('');
        setError('');
    }

    const handlePassNumberClear = () => {
        setPassNumber('');
        setError('');
    }

    const isValidToShowNextPage = useMemo<boolean>(() => {
        return !!name.length && !!lastName.length && email.length > 4 && password.length > 4
    }, [email, name, lastName, password])

    const handleNextPageClick = () => {
        if (!isValidToShowNextPage) return;
        setPageId('addUserData');
    }

    const isValidToRegister = useMemo<boolean>(() => {
        return !!name.length
            && !!lastName.length
            && email.length > 4
            && password.length > 4
            && inn.length > 4
            && address.length > 4
            && passNumber.length > 4
    }, [email, name, lastName, password, inn, address, passNumber])

    const handleRegisterClick = () => {
        if (!isValidToRegister) {
            setError('Заполните все поля');
            return;
        }

        const payload: TUserDataToSend = {name, lastName, email, password, inn, address, passNumber};

        testUserRegistration(payload)
            .then((data: TRegistrationPayload) => {
                setIsLoading(false);
                setUserData({
                    firstName: data.name,
                    lastLame: data.lastName,
                    patronymic: '', // отчество что ли ?
                    id: Number(data.id),
                    email: data.email,
                    phone: '',
                    address: data.address,
                    inn: data.inn,
                    status: '',
                    passNumber: data.passNumber
                });
                setIsAuth(true);
                setError('');
            })
            .catch((error) => {
                setError('Ошибка регистрации');
                setIsLoading(false);
            })
    }

    const testUserRegistration = (payload: TUserDataToSend): Promise<TRegistrationPayload> => {
        setIsLoading(true);

        return new Promise((resolve, reject) => {
            if (!payload) reject();

            // 4 digit number
            const testNewUserId = String(Math.floor(1000 + Math.random() * 9000));

            const newUserData: TRegistrationPayload = {
                ...payload,
                id: testNewUserId
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

            window.setTimeout(() => {
                resolve(newUserData)
            }, 1500)
        })
    }

    const renderCredentialsPage = () => {
        return (
            <>
                <div className={styles['step-caption']}>Шаг 1</div>
                <Input
                    value={name}
                    placeholder='Имя'
                    className={styles['item']}
                    tabIndex={0}
                    onChange={handleNameChange}
                    error={null}
                    size={InputSize.Medium}
                    name='client_name'
                    onClear={handleNameClear}
                />
                <Input
                    value={lastName}
                    placeholder='Фамилия'
                    className={styles['item']}
                    tabIndex={0}
                    onChange={handleLastNameChange}
                    error={null}
                    size={InputSize.Medium}
                    name='client_last_name'
                    onClear={handleLastNameClear}
                />
                <Input
                    type='email'
                    value={email}
                    placeholder='Email'
                    className={styles['item']}
                    tabIndex={0}
                    onChange={handleEmailChange}
                    error={null}
                    size={InputSize.Medium}
                    name='client_email'
                    onClear={handleEmailClear}
                />
                <Input
                    type='password'
                    value={password}
                    placeholder='Пароль'
                    className={styles['item']}
                    tabIndex={0}
                    onChange={handlePasswordChange}
                    error={null}
                    size={InputSize.Medium}
                    name='client_password'
                    onClear={handlePasswordClear}
                />
                <div className={styles['error']}>{error ? error : ''}</div>
                <Button disabled={!isValidToShowNextPage} onClick={handleNextPageClick}>Далее</Button>
            </>
        )
    }

    const renderAddUserDataPage = () => {
        return (
            <>
                <div className={styles['step-caption']}>Шаг 2</div>
                <Input
                    value={inn}
                    placeholder='ИНН'
                    className={styles['item']}
                    tabIndex={0}
                    onChange={handleInnChange}
                    size={InputSize.Medium}
                    name='client_inn'
                    onClear={handleInnClear}
                />
                <Input
                    value={address}
                    placeholder='Адрес'
                    className={styles['item']}
                    tabIndex={0}
                    onChange={handleAddressChange}
                    size={InputSize.Medium}
                    name='client_address'
                    onClear={handleAddressClear}
                />
                <Input
                    value={passNumber}
                    placeholder='Номер паспорта'
                    className={styles['item']}
                    tabIndex={0}
                    onChange={handlePassNumberChange}
                    size={InputSize.Medium}
                    name='client_pass_number'
                    onClear={handlePassNumberClear}
                />
                <div className={styles['error']}>{error ? error : ''}</div>
                <Button disabled={!isValidToRegister} onClick={handleRegisterClick}>Зарегистрироваться</Button>
            </>
        )
    }

    const renderContentByPageId = () => {
        switch (pageId) {
            case "credentials": return renderCredentialsPage();
            case "addUserData": return renderAddUserDataPage();
        }
    }

    return (
        <div className={styles['registration-form']}>
            {isLoading && <LoaderCircle />}
            {renderContentByPageId()}
        </div>
    )
})

export default NewRequestRegistrationForm;