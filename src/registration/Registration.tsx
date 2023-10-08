import React, {useCallback, useState} from "react";
import styles from "./Registration.module.sass";
import {Button, Checkbox, Form, Input} from "antd";
import { UserOutlined } from '@ant-design/icons';
import { MdAlternateEmail } from 'react-icons/md';
import { HiOutlineLockClosed } from 'react-icons/hi';
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import {Link} from "react-router-dom";
import {useAuth} from "../components/hooks/useAuth";

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
    const {isAuth} = useAuth();

    const [pwdNumbersError, setPwdNumbersError] = useState<boolean>(false);

    const onSubmitForm = async (values: IRegisterFormData) => {
        console.log('Received values of form: ', values);
        //TODO validation ?
        const isValidPassword = checkNumbers(values.password);
        if (!isValidPassword) {
            setPwdNumbersError(true);
            return;
        }

        setPwdNumbersError(false);
        // await registerUser({
        //     username: values.name,
        //     email: values.email,
        //     password: values.password,
        //     confirmPassword: values.confirmPassword,
        //     checkbox: values.checkbox
        // });
    };

    const checkNumbers = (password: string): boolean => {
        const pwdArray = password.split('');
        const numbers: number[] = [];

        for (let i = 0; i < pwdArray.length; i++) {
            const curEl = pwdArray[i];
            if (!isNaN(Number(curEl))) {
                numbers.push(Number(curEl));
            }
        }

        return !(!numbers.length || numbers.length === 1);
    }

    const handleFieldsChange = () => {
        setPwdNumbersError(false);
    }

    return (
        <Form
            form={form}
            className={styles.registration}
            name="register"
            onFinish={onSubmitForm}
            onFieldsChange={handleFieldsChange}
        >
            <div className={styles.container}>
                <div className={styles.info_container}>
                    <span className={styles.reg_icon} />
                </div>
                <div className={styles.inputs_container}>
                    <div className={styles.caption}>Регистрация</div>
                    <span className={styles.text}>После регистрации вам станут доступны все возможности сервиса.</span>
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста введите свое имя',
                            },
                        ]}
                    >
                        <Input
                            allowClear
                            size="large"
                            placeholder="Имя"
                            prefix={<UserOutlined />}
                            // onChange={(e) => handleInputChange(InputType.userName, e)}
                            required
                        />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста введите свой E-mail',
                            },
                        ]}
                    >
                        <Input
                            allowClear
                            size="large"
                            placeholder="E-mail"
                            prefix={<MdAlternateEmail />}
                            // onChange={(e) => handleInputChange(InputType.email, e)}
                            type='email'
                        />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста введите пароль',
                            },
                            {
                                min: 8,
                                message: 'Мин. 8 символов: цифры и латинские буквы',
                            },
                            // ({ getFieldValue }) => ({
                            //     validator(_, value) {
                            //         const pwd: string = getFieldValue('password');
                            //         if (!value) {
                            //             return Promise.resolve();
                            //         }
                            //         if (pwd === value && pwd.length < 8) {
                            //             return Promise.reject(new Error('Мин. 8 символов: цифры и латинские буквы'));
                            //         }
                            //         if (pwd === value && pwd.length >= 8) {
                            //             return Promise.resolve();
                            //         }
                            //     },
                            // }),
                        ]}
                        hasFeedback={true}
                    >
                        <Input.Password
                            allowClear
                            size="large"
                            placeholder="Пароль"
                            prefix={<HiOutlineLockClosed />}
                            // onChange={(e) => handleInputChange(InputType.password, e)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirm"
                        rules={[
                            {
                                required: true,
                                message: 'Пожалуйста подтвердите пароль',
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Введеный пароль не соответствует'));
                                },
                            }),
                        ]}
                        hasFeedback={true}
                        dependencies={['password']}
                    >
                        <Input.Password
                            allowClear
                            size="large"
                            placeholder="Подтвердите пароль"
                            prefix={<HiOutlineLockClosed />}
                        />
                    </Form.Item>
                    <Form.Item
                        name="agreement"
                        valuePropName="checked"
                        rules={[
                            {
                                validator: (_, value) =>
                                    value ? Promise.resolve() : Promise.reject(new Error('Нужно принять правила')),
                            },
                        ]}
                    >
                        <div className={styles.checkbox_block}>
                            <Checkbox>{AGREEMENT_TEXT}</Checkbox>
                        </div>
                    </Form.Item>
                    <div className={styles.pwd_description}>
                        <div>{pwdNumbersError && 'Пароль не соответствует требованию: минимум 2 цифры'}</div>
                        {/*<div>{error && error.message}</div>*/}
                    </div>
                    <div className={styles.buttons_block}>
                        <Button disabled={pwdNumbersError} size="large" className={styles.button_body} htmlType="submit">
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
        </Form>
    )
}

export default Registration;