import React, {useCallback, useState} from "react";
import styles from "./Registration.module.sass";
import {useAuth} from "../hooks/useAuth";
import {Button, Checkbox, Form, Input} from "antd";
import { UserOutlined } from '@ant-design/icons';
import { MdAlternateEmail } from 'react-icons/md';
import { HiOutlineLockClosed } from 'react-icons/hi';
import {CheckboxChangeEvent} from "antd/es/checkbox";
import { HiOutlineRocketLaunch } from "react-icons/hi2";
import {Link} from "react-router-dom";

export enum InputType {
    userName,
    email,
    password,
    confirmPassword,
}

const AGREEMENT_TEXT = 'Я подтверждаю, что ознакомлен с правилами и даю свое согласие на обработку персональных данных ООО «ДОНОСЫ».'

const Registration = () => {
    const [form] = Form.useForm();
    const {registerUser, error, setError} = useAuth();

    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [pwd, setPwd] = useState<string>('');
    const [confirmPwd, setConfirmPwd] = useState<string>('');
    const [checkbox, setCheckbox] = useState<boolean>(false);

    const handleRegistrationSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await registerUser({
            first_name: userName,
            email: email,
            password: pwd,
            agreement_checkbox: checkbox
        });
    }

    const handleInputChange = useCallback((type: InputType, e:  React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        setError(null);

        switch (type) {
            case InputType.userName: {
                setUserName(inputValue);
                break;
            }
            case InputType.email: {
                setEmail(inputValue);
                break;
            }
            case InputType.password: {
                setPwd(inputValue);
                break;
            }
            case InputType.confirmPassword: {
                setConfirmPwd(inputValue);
                break;
            }
        }
    }, [])

    const handleCheckBoxChange = useCallback((e: CheckboxChangeEvent) => {
        setCheckbox(e.target.checked);
    }, [])

    const onSubmitForm = (values: any) => {
        console.log('Received values of form: ', values);
        //TODO validation ?
    };

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
                            onChange={(e) => handleInputChange(InputType.userName, e)}
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
                            onChange={(e) => handleInputChange(InputType.email, e)}
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
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    const pwd: string = getFieldValue('password');
                                    if (!value) {
                                        return Promise.resolve();
                                    }
                                    if (pwd === value && pwd.length < 8) {
                                        return Promise.reject(new Error('Мин. 8 символов: цифры и латинские буквы'));
                                    }
                                    if (pwd === value && pwd.length >= 8) {
                                        return Promise.resolve();
                                    }
                                },
                            }),
                        ]}
                        hasFeedback={true}
                    >
                        <Input.Password
                            allowClear
                            size="large"
                            placeholder="Пароль"
                            prefix={<HiOutlineLockClosed />}
                            onChange={(e) => handleInputChange(InputType.password, e)}
                        />
                        {/*<div className={styles.pwd_description}>Мин. 8 символов: цифры и латинские буквы</div>*/}
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
                            onChange={(e) => handleInputChange(InputType.confirmPassword, e)}
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
                            <Checkbox onChange={handleCheckBoxChange}>{AGREEMENT_TEXT}</Checkbox>
                        </div>
                    </Form.Item>
                    <div className={styles.buttons_block}>
                        <Button size="large" className={styles.button_body} htmlType="submit">
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