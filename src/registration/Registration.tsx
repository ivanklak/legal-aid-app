import React, {useCallback, useEffect, useState} from "react";
import styles from "./Registration.module.sass";
import {Button, Checkbox, Form, Input, message} from "antd";
import { UserOutlined } from '@ant-design/icons';
import { MdAlternateEmail } from 'react-icons/md';
import { HiOutlineLockClosed } from 'react-icons/hi';
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import {Link, useNavigate} from "react-router-dom";
import {ValidateStatus} from "antd/es/form/FormItem";
import {requestCreateAccount} from "../service/network/registration/methods/createAccount";

export enum InputType {
    userName,
    email,
    password,
    confirmPassword,
}

interface IRegisterFormData {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    checkbox: boolean;
}

const AGREEMENT_TEXT = 'Я подтверждаю, что ознакомлен с правилами и даю свое согласие на обработку персональных данных ООО «ДОНОСЫ».'

const Registration = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    // inputs values
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    // pwds statuses
    const [passwordValidStatus, setPasswordValidStatus] = useState<ValidateStatus>('');
    const [confirmPasswordValidStatus, setConfirmPasswordValidStatus] = useState<ValidateStatus>('');
    // checkbox
    const [checkboxValue, setCheckboxValue] = useState<boolean>(false);
    // disable
    const [regButtonActive, setRegButtonActive] = useState<boolean>(false);
    // errors
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        if (!name ||
            !email ||
            passwordValidStatus !== 'success' ||
            confirmPasswordValidStatus !== 'success' ||
            !checkboxValue
        ) {
            setRegButtonActive(false);
        } else {
            setRegButtonActive(true);
        }
    }, [checkboxValue, confirmPasswordValidStatus, email, name, passwordValidStatus])

    const onSubmitForm = async (values: IRegisterFormData) => {
        try {
            const response = await requestCreateAccount({
                firstName: name,
                email: email,
                password: password,
                agreementCheckbox: checkboxValue
            })

            if (response) {
                messageApi.open({
                    type: "success",
                    content: "Аккаунт успешно создан"
                }).then(() => navigate('/login'))
            }
        } catch (e) {
            console.log('e', e)
            setError(true);
            // TODO непорядок - если ошибка 403 -> пользователь уже существует
        }
    };

    const handleInputChange = (type: InputType, value: string) => {
        switch (type) {
            case InputType.userName: {
                setName(value);
                break;
            }
            case InputType.email: {
                setEmail(value);
                break;
            }
            case InputType.password: {
                validatePassword(value);
                setPassword(value);
                break;
            }
            case InputType.confirmPassword: {
                validateConfirmPassword(value);
                setConfirmPassword(value);
                break;
            }
        }
    }

    const handleCheckboxChange = useCallback((value: boolean) => {
        setCheckboxValue(value);
    }, [])

    // проверка требований к паролю
    const validatePassword = useCallback((value: string) => {
        // пароль меньше 8 символов
        if (value.length < 8) {
            setPasswordValidStatus('');
            return;
        }
        // пароль имеет цифры
        const hasNumbers = checkNumbers(value);
        // пароль имеет буквы
        const hasLetters = checkLetters(value);
        if (!hasNumbers || !hasLetters) {
            setPasswordValidStatus('error');
            return;
        }
        // хороший пароль
        setPasswordValidStatus('success');
    }, [])

    // проверка требований к повтору пароля
    const validateConfirmPassword = useCallback((value: string) => {
        // пароль меньше 8 символов
        if (value.length < 8) {
            setConfirmPasswordValidStatus('');
            return;
        }
        // пароли не совпадают
        if (value !== password) {
            setConfirmPasswordValidStatus('error');
            return;
        }
        // пароли совпадают
        setConfirmPasswordValidStatus('success');
    }, [password])

    // проверка на буквы
    const checkLetters = (password: string): boolean => {
        const pwdArray = password.split('');
        return pwdArray.some((letter) => letter.toUpperCase() !== letter.toLowerCase())
    }

    const checkNumbers = (password: string): boolean => {
        const pwdArray = password.split('');
        const numbers: number[] = [];

        for (let i = 0; i < pwdArray.length; i++) {
            const curEl = pwdArray[i];
            if (!isNaN(Number(curEl))) {
                numbers.push(Number(curEl));
            }
        }

        return numbers.length > 0;
    }

    return (
        <Form
            form={form}
            className={styles.registration}
            name="register"
            onFinish={onSubmitForm}
        >
            <div className={styles.container}>
                <div className={styles.info_container}>
                    <span className={styles.reg_icon} />
                </div>
                <div className={styles.inputs_container}>
                    <div className={styles.caption}>Регистрация</div>
                    <span className={styles.text}>После регистрации вам станут доступны все возможности сервиса.</span>
                    <Form.Item name="name">
                        <Input
                            allowClear
                            size="large"
                            placeholder="Имя"
                            prefix={<UserOutlined />}
                            onChange={(e) => handleInputChange(InputType.userName, e.target.value)}
                            required
                        />
                    </Form.Item>
                    <Form.Item name="email">
                        <Input
                            allowClear
                            size="large"
                            placeholder="E-mail"
                            prefix={<MdAlternateEmail />}
                            onChange={(e) => handleInputChange(InputType.email, e.target.value)}
                            type='email'
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        hasFeedback={true}
                        validateStatus={passwordValidStatus}
                        className={styles['password-item']}
                    >
                        <Input.Password
                            size="large"
                            placeholder="Пароль"
                            prefix={<HiOutlineLockClosed />}
                            onChange={(e) => handleInputChange(InputType.password, e.target.value)}
                        />
                        <span className={styles['title']}>Мин. 8 символов: цифры и латинские буквы</span>
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        hasFeedback={true}
                        validateStatus={confirmPasswordValidStatus}
                        dependencies={['password']}
                    >
                        <Input.Password
                            size="large"
                            placeholder="Подтвердите пароль"
                            prefix={<HiOutlineLockClosed />}
                            onChange={(e) => handleInputChange(InputType.confirmPassword, e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                    >
                        <div className={styles.checkbox_block}>
                            <Checkbox
                                value={checkboxValue}
                                onChange={(e) => handleCheckboxChange(e.target.checked)}
                            >
                                {AGREEMENT_TEXT}
                            </Checkbox>
                        </div>
                    </Form.Item>
                    <div className={styles.pwd_description}>
                        {/*<div>{pwdNumbersError && 'Пароль не соответствует требованию: минимум 2 цифры'}</div>*/}
                        <div>{error && 'Произошла ошибка.'}</div>
                    </div>
                    <div className={styles.buttons_block}>
                        <Button disabled={!regButtonActive} size="large" className={styles.button_body} htmlType="submit">
                            <div className={styles.button_content}>
                                <HiOutlineRocketLaunch />
                                <div>Создать аккаунт</div>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>
            <div className={styles.has_account}>
                <span>Уже есть аккаунт?</span>
                <Link to={'/login'} className={styles.link}>Войти</Link>
            </div>
            {contextHolder}
        </Form>
    )
}

export default Registration;