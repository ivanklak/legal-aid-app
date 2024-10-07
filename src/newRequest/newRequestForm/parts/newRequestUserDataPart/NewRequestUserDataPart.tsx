import React, {memo, useState} from "react";
import styles from "./NewRequestUserDataPart.module.sass";
import Button from "../../../../designSystem/button/Button";
import {Input, InputSize} from "../../../../designSystem/input";
import {LoaderCircle} from "../../../../designSystem/loader/Loader.Circle";
import {Checkbox, Segmented} from "antd";
import {useAuth} from "../../../../app/hooks/useAuth";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import NewRequestRegistrationForm from "../../components/newRequestRegistrationForm/NewRequestRegistrationForm";
import {IUserLoginResponse, testUserLogin} from "../../../../app/auth/methods/testUserLogin";

interface NewRequestUserDataPartProps {
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
}

type TPageId = 'login' | 'registration';

const pages = [
    {label: 'Логин', value: 'login'},
    {label: 'Регистрация', value: 'registration'},
]

const NewRequestUserDataPart = memo<NewRequestUserDataPartProps>(({onPrevPageClick, onNextPageClick}) => {
    const [currentPageId, setCurrentPageId] = useState<TPageId>('login');
    const {userData, setUserData, isAuth, setIsAuth} = useAuth();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [hasAgreement, setHasAgreement] = useState<boolean>(false);

    const handleEmailChange = (value: string, event?: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(value);
    }

    const handlePasswordChange = (value: string) => {
        setPassword(value);
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

        testUserLogin({email: email, password: password})
            .then((data: IUserLoginResponse) => {
                if (!data) {
                    setError('Не верный email или пароль');
                    setIsAuth(false);
                } else {
                    setUserData({
                        id: data.id,
                        role: data.role,
                        firstName: data.name,
                        email: data.email,
                    });
                    // обязательно - для восстановления сессии
                    localStorage.setItem('last_id', userData.id);
                    //
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

    const renderContentByCurrentId = () => {
        switch (currentPageId) {
            case "login": return renderLoginForm();
            case "registration": {
                return <NewRequestRegistrationForm />
            }
        }
    }

    return (
        <div className={styles['user-data']}>
            {isLoading && <LoaderCircle />}
            {/*<h2 className={styles['caption']}>{CAPTION}</h2>*/}
            <div className={styles['login-container']}>
                {isAuth && userData ? (
                    <div className={styles['login-user-data']}>
                        <div className={styles['name']}>{userData.firstName}</div>
                        <div className={styles['data-item']}>Адресс: {userData.address}</div>
                        <div className={styles['data-item']}>Email: {userData.email}</div>
                        {userData.passNumber && <div className={styles['data-item']}>Номер паспорта: {userData.passNumber}</div>}
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