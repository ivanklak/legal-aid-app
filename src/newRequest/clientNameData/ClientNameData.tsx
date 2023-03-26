import React, {FC, useCallback, useState} from "react";
import {Input, InputSize} from "../../components/input";
import classNames from "classnames";
import styles from "./ClientNameData.module.sass";

enum ClientField {
    FirstName,
    LastName ,
    FathersName,
    AddressStreet,
    AddressIndex,
    AddressCity
}

interface ClientNameDataProps {
    onSubmitForm: (success: boolean) => void
}

const ClientNameData: FC<ClientNameDataProps> = ({ onSubmitForm }) => {
    const [firstName, setFirstName] = useState<string>(null);
    const [lastName, setLastName] = useState<string>(null);
    const [fathersName, setFathersName] = useState<string>(null);

    const [street, setStreet] = useState<string>(null);
    const [index, setIndex] = useState<string>(null);
    const [city, setCity] = useState<string>(null);

    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    const changeHandle = (field: ClientField, value: string) => {
        setSuccess(false);
        setError(null);

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
            case ClientField.AddressStreet: {
                setStreet(value);
                return;
            }
            case ClientField.AddressIndex: {
                setIndex(value);
                return;
            }
            case ClientField.AddressCity: {
                setCity(value);
                return;
            }
        }
    }

    const submitHandle = useCallback(() => {
        if (!!firstName && !!lastName && !!street && !!index && !!city) {
            setSuccess(true);
            onSubmitForm(true);
        } else {
            setSuccess(false);
            setError('Пожалуйста заполните все поля')
            onSubmitForm(false);
        }
    }, [firstName, lastName, street, index, city, onSubmitForm])

    return (
        <>
            <div className={styles.title}>Контактные данные</div>
            <div className={classNames(
                styles.clientForm,
                success && styles.success
            )}>
                <div className={styles.subTitle}>Клиент</div>
                <div className={styles.clientInfo}>
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
                        autoFocus
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
                        autoFocus
                        tabIndex={0}
                        onChange={(value, event) => changeHandle(ClientField.FathersName, value)}
                        error={null}
                        size={InputSize.Medium}
                        name={'client_fathersName'}
                        disabled={false}
                    />
                </div>
                <div className={styles.addressBlock}>
                    <div className={styles.subTitle}>
                        Адресс
                    </div>
                    <Input
                        value={street}
                        placeholder={'Улица, дом, кв.'}
                        autoFocus
                        tabIndex={0}
                        onChange={(value, event) => changeHandle(ClientField.AddressStreet, value)}
                        error={null}
                        size={InputSize.Medium}
                        name={'client_address_street'}
                        disabled={false}
                    />
                    <div className={styles.address}>
                        <Input
                            className={styles.customInput}
                            value={index}
                            placeholder={'Индекс'}
                            autoFocus
                            tabIndex={0}
                            onChange={(value, event) => changeHandle(ClientField.AddressIndex, value)}
                            error={null}
                            size={InputSize.Medium}
                            name={'client_address_index'}
                            disabled={false}
                        />
                        <Input
                            value={city}
                            placeholder={'Область, город'}
                            autoFocus
                            tabIndex={0}
                            onChange={(value, event) => changeHandle(ClientField.AddressCity, value)}
                            error={null}
                            size={InputSize.Medium}
                            name={'client_address_city'}
                            disabled={false}
                        />
                    </div>
                </div>
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