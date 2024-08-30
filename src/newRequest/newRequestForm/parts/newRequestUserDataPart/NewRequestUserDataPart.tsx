import React, {memo, useState} from "react";
import styles from "./NewRequestUserDataPart.module.sass";
import Button from "../../../../controls/button/Button";
import {Input, InputSize} from "../../../../components/input";
import {LoaderCircle} from "../../../../components/loader/Loader.Circle";
import {Checkbox, Segmented} from "antd";
import {useAuth} from "../../../../components/hooks/useAuth";
import {IUserData} from "../../../../login/api/AuthServise";
import {CheckboxChangeEvent} from "antd/es/checkbox";

interface NewRequestUserDataPartProps {
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
}

type TPageId = 'login' | 'registration';

const CAPTION = 'Оставьте ваши контакты';
const pages = [
    {label: 'Логин', value: 'login'},
    {label: 'Регистрация', value: 'registration'},
]
const loginEmails = ['test@gmail.com', 'test@test.com'];

const MOCK_USERS: IUserData[] = [
    {
        firstName: "Райан",
        lastLame: "Гослинг",
        address: "125363 Nelidovskaya street 21, Calabasas, CA, USA",
        email: "test@test.com",
        id: 7007,
        inn: "007",
        patronymic: "",
        phone: "+7999-999-99-99",
        status: "ken"
    },
    {
        firstName: "Оптимус",
        lastLame: "Прайм",
        address: "125363 Putilkovskoe shosse 3, Vancouver, Canada",
        email: "test@gmail.com",
        id: 9009,
        inn: "009",
        patronymic: "",
        phone: "+7999-777-77-77",
        status: "autobot"
    }
]

const NewRequestUserDataPart = memo<NewRequestUserDataPartProps>(({onPrevPageClick, onNextPageClick}) => {
    const [currentPageId, setCurrentPageId] = useState<TPageId>('login');
    const {userData, setUserData, isAuth, setIsAuth} = useAuth();

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [inn, setInn] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [hasAgreement, setHasAgreement] = useState<boolean>(false);

    const handleNameChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        setName(value);
    }

    const handleEmailChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(value);
    }

    const handlePasswordChange = (value: string) => {
        setPassword(value);
    }

    const handleNameClear = () => {
        setName('');
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

    const handleLoginClick = () => {
        if (!email || !password) {
            setError('Введите email и пароль');
            return;
        }

        testUserLogin(email)
            .then((userData) => {
                if (!userData) {
                    setError('Не верный email или пароль');
                    setIsAuth(false);
                } else {
                    setUserData(userData);
                    setIsAuth(true);
                    setError(null);
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                setError('Не верный email или пароль');
                console.log('error', error)
            })
    }

    const handleRegisterClick = () => {
        if (!name || !email || !password) {
            setError('Заполните все поля');
            return;
        }
    }

    const testUserLogin = (value: string): Promise<IUserData> => {
        setIsLoading(true);

        return new Promise((resolve, reject) => {
            if (!value) reject();

            window.setTimeout(() => {
                const isValidEmail = loginEmails.includes(value);

                if (!isValidEmail) {
                    resolve(null);
                } else {
                    const reqUserData = MOCK_USERS.find((data) => data.email === value)

                    if (!reqUserData) {
                        resolve(null);
                    } else {
                        resolve(reqUserData);
                    }
                }
            }, 1500)
        })
    }

    const handlePageChange = (value: any) => {
        setCurrentPageId(value);
    }

    const handleCheckbox = (e: CheckboxChangeEvent) => {
        setHasAgreement(e.target.checked);
    }

    const renderLoginForm = () => {
        return (
            <>
                <Input
                    type='email'
                    value={email}
                    placeholder={'Email'}
                    className={styles['login-item']}
                    tabIndex={0}
                    onChange={handleEmailChange}
                    error={null}
                    size={InputSize.Medium}
                    name={'client_email'}
                    onClear={handleEmailClear}
                />
                <Input
                    type='password'
                    value={password}
                    placeholder={'Пароль'}
                    className={styles['login-item']}
                    tabIndex={0}
                    onChange={handlePasswordChange}
                    error={null}
                    size={InputSize.Medium}
                    name={'client_password'}
                    onClear={handlePasswordClear}
                />
                <div className={styles['error']}>{error ? error : ''}</div>
                <Button disabled={email.length < 4 || password.length < 4} onClick={handleLoginClick}>Войти</Button>
            </>
        )
    }

    const renderRegistrationForm = () => {
        return (
            <>
                <Input
                    value={name}
                    placeholder={'Имя'}
                    className={styles['login-item']}
                    tabIndex={0}
                    onChange={handleNameChange}
                    error={null}
                    size={InputSize.Medium}
                    name={'client_name'}
                    onClear={handleNameClear}
                />
                <Input
                    type='email'
                    value={email}
                    placeholder={'Email'}
                    className={styles['login-item']}
                    tabIndex={0}
                    onChange={handleEmailChange}
                    error={null}
                    size={InputSize.Medium}
                    name={'client_email'}
                    onClear={handleEmailClear}
                />
                <Input
                    type='password'
                    value={password}
                    placeholder={'Пароль'}
                    className={styles['login-item']}
                    tabIndex={0}
                    onChange={handlePasswordChange}
                    error={null}
                    size={InputSize.Medium}
                    name={'client_password'}
                    onClear={handlePasswordClear}
                />
                <div className={styles['error']}>{error ? error : ''}</div>
                <Button disabled={email.length < 4} onClick={handleRegisterClick}>Зарегистрироваться</Button>
            </>
        )
    }

    const renderContentByCurrentId = () => {
        switch (currentPageId) {
            case "login": return renderLoginForm();
            case "registration": return renderRegistrationForm();
        }
    }

    return (
        <div className={styles['user-data']}>
            {isLoading && <LoaderCircle />}
            {/*<h2 className={styles['caption']}>{CAPTION}</h2>*/}
            <div className={styles['login-container']}>
                {isAuth && userData ? (
                    <div className={styles['login-user-data']}>
                        <div className={styles['name']}>{userData.firstName} {userData.lastLame}</div>
                        <div className={styles['data-item']}>Email: {userData.email}</div>
                        <div className={styles['data-item']}>Адресс: {userData.address}</div>
                        <div className={styles['data-item']}>ИНН: {userData.inn}</div>
                    </div>
                ) : (
                    <div className={styles['login-form']}>
                        <Segmented
                            options={pages}
                            value={currentPageId}
                            onChange={handlePageChange}
                            className={styles['login-pages']}
                            block
                        />
                        {renderContentByCurrentId()}
                    </div>
                )}
            </div>
            {isAuth && (
                <>
                    <div>
                        <Checkbox onChange={handleCheckbox}>Настоящим подтверждаю, что мои данные верны</Checkbox>
                    </div>
                    <div className={styles['buttons']}>
                        <Button onClick={onPrevPageClick} className={styles['back-btn']}>Назад</Button>
                        <Button disabled={!hasAgreement} onClick={onNextPageClick} className={styles['next-btn']}>Далее</Button>
                    </div>
                </>
            )}
        </div>
    )
})

export default NewRequestUserDataPart;