import React, {FC, useCallback, useState} from "react";
import {Input, InputSize} from "../../components/input";
import classNames from "classnames";
import styles from "./ClientNameData.module.sass";

enum ClientField {
    FirstName,
    LastName ,
    FathersName,
    Email,
    Phone
}

interface ClientNameDataProps {
    onSubmitForm: (success: boolean) => void
}

const ClientNameData: FC<ClientNameDataProps> = ({ onSubmitForm }) => {
    const [firstName, setFirstName] = useState<string>(null);
    const [lastName, setLastName] = useState<string>(null);
    const [fathersName, setFathersName] = useState<string>(null);

    const [email, setEmail] = useState<string>(null);
    const [phone, setPhone] = useState<string>(null);

    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    const changeHandle = (field: ClientField, value: string) => {
        setSuccess(false);
        setError(null);
        onSubmitForm(false);

        switch (field) {
            case ClientField.FirstName: {
                setFirstName(value);
                return;
            }
            case ClientField.LastName: {
                setLastName(value);
                return;
            }
            case ClientField.FathersName: {
                setFathersName(value);
                return;
            }
            case ClientField.Email: {
                setEmail(value);
                return;
            }
            case ClientField.Phone: {
                setPhone(value);
                return;
            }
        }
    }

    const checkPhone = useCallback((): boolean => {
        if (phone && !!phone.length) {
            const str = phone.replace('+', '');

            if (str.length !== 11) return false;
            return !isNaN(Number(str));
        }
        return false
    }, [phone])

    const submitHandle = useCallback(() => {
        const phoneCorrect = checkPhone();
        const isValidEmail = /^.+@.+\..+$/.test(email);

        if (!phoneCorrect || !isValidEmail) {
            setSuccess(false);
            setError('Неправильный телефон или email.')
            onSubmitForm(false);
            return;
        }

        if (!!firstName && !!lastName && !!email && !!phone) {
            setSuccess(true);
            onSubmitForm(true);
        } else {
            setSuccess(false);
            setError('Пожалуйста заполните все поля.')
            onSubmitForm(false);
        }
    }, [checkPhone, firstName, lastName, email, phone, onSubmitForm])

    return (
        <>
            <div className={styles.title}>Контактные данные</div>
            <div className={classNames(
                styles.clientForm,
                success && styles.success
            )}>
                <div className={styles.subTitle}>Клиент</div>
                <div className={styles.clientInfo}>
                    <div className={styles.nameBlock}>
                        <Input
                            value={firstName}
                            placeholder={'Имя'}
                            autoFocus
                            tabIndex={0}
                            onChange={(value, event) => changeHandle(ClientField.FirstName, value)}
                            error={null}
                            size={InputSize.Medium}
                            name={'client_firstname'}
                            disabled={false}
                        />
                        <Input
                            value={lastName}
                            placeholder={'Фамилия'}
                            tabIndex={0}
                            onChange={(value, event) => changeHandle(ClientField.LastName, value)}
                            error={null}
                            size={InputSize.Medium}
                            name={'client_lastName'}
                            disabled={false}
                        />
                        <Input
                            value={fathersName}
                            placeholder={'Отчетство'}
                            tabIndex={0}
                            onChange={(value, event) => changeHandle(ClientField.FathersName, value)}
                            error={null}
                            size={InputSize.Medium}
                            name={'client_fathersName'}
                            disabled={false}
                        />
                    </div>
                    <div className={styles.emailBlock}>
                        <Input
                            value={email}
                            placeholder={'Email'}
                            tabIndex={0}
                            onChange={(value, event) => changeHandle(ClientField.Email, value)}
                            error={null}
                            size={InputSize.Medium}
                            name={'client_email'}
                            disabled={false}
                        />
                        <Input
                            value={phone}
                            placeholder={'+79XXXXXXXXX'}
                            tabIndex={0}
                            onChange={(value, event) => changeHandle(ClientField.Phone, value)}
                            error={null}
                            size={InputSize.Medium}
                            autoComplete={'tel'}
                            name={'client_phone'}
                            disabled={false}
                        />
                    </div>
                </div>
                {/*<div className={styles.addressBlock}>*/}
                {/*    <div className={styles.subTitle}>*/}
                {/*        Адресс*/}
                {/*    </div>*/}
                {/*    <Input*/}
                {/*        value={street}*/}
                {/*        placeholder={'Улица, дом, кв.'}*/}
                {/*        tabIndex={0}*/}
                {/*        onChange={(value, event) => changeHandle(ClientField.AddressStreet, value)}*/}
                {/*        error={null}*/}
                {/*        size={InputSize.Medium}*/}
                {/*        name={'client_address_street'}*/}
                {/*        disabled={false}*/}
                {/*    />*/}
                {/*    <div className={styles.address}>*/}
                {/*        <Input*/}
                {/*            className={styles.customInput}*/}
                {/*            value={index}*/}
                {/*            placeholder={'Индекс'}*/}
                {/*            tabIndex={0}*/}
                {/*            onChange={(value, event) => changeHandle(ClientField.AddressIndex, value)}*/}
                {/*            error={null}*/}
                {/*            size={InputSize.Medium}*/}
                {/*            name={'client_address_index'}*/}
                {/*            disabled={false}*/}
                {/*        />*/}
                {/*        <Input*/}
                {/*            value={city}*/}
                {/*            placeholder={'Область, город'}*/}
                {/*            tabIndex={0}*/}
                {/*            onChange={(value, event) => changeHandle(ClientField.AddressCity, value)}*/}
                {/*            error={null}*/}
                {/*            size={InputSize.Medium}*/}
                {/*            name={'client_address_city'}*/}
                {/*            disabled={false}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</div>*/}
                <div className={styles.submitBlock}>
                    <div className={styles.error}>{error}</div>
                    <div
                        className={classNames(
                            styles.submitButton,
                        )}
                        onClick={submitHandle}
                    >
                        Подтвердить
                    </div>
                </div>
            </div>
        </>
    )
}

export default ClientNameData;