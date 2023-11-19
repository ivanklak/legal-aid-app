import React, {FC, useCallback, useEffect, useState} from "react";
import {ISuggestions} from "../../api/requests/GetOrganisationSuggestionsRequest";
import styles from "./ManualForm.module.sass";
import {Input} from "antd";
import classNames from "classnames";

enum InputID {
    name,
    inn,
    address
}

export interface SavedOrgData {
    name: string;
    inn: string;
    address: string;
}

interface ManualFormProps {
    selectedOrganisation?: ISuggestions;
    saveOrganisationData: (data: SavedOrgData) => void;
    disabled?: boolean
    clean?: boolean
}

const ManualForm: FC<ManualFormProps> = ({selectedOrganisation, saveOrganisationData, disabled, clean}) => {
    const [name, setName] = useState<string>(selectedOrganisation ? selectedOrganisation.value : '');
    const [inn, setInn] = useState<string>(selectedOrganisation ? selectedOrganisation.data.inn : '');
    const [address, setAddress] = useState<string>(selectedOrganisation ? selectedOrganisation.data.address.value :'');

    const [error, setError] = useState<boolean>(false);
    const [message, setMessage] = useState<string>(null);

    useEffect(() => {
        if (clean) {
            setName('');
            setInn('');
            setAddress('');
        }
    }, [clean])

    useEffect(() => {
        if (!selectedOrganisation) return;

        setName(selectedOrganisation.value);
        setInn(selectedOrganisation.data.inn);

        const fullAddress = `${selectedOrganisation.data.address.data.postal_code}, ${selectedOrganisation.data.address.value}`;
        setAddress(fullAddress);
    }, [selectedOrganisation])

    useEffect(() => {
        saveOrganisationData({name, inn, address});
    }, [name, inn, address])

    const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, id: InputID) => {
        setError(false);
        const value = e.target.value;
        switch (id) {
            case InputID.name: {
                setName(value);
                break;
            }
            case InputID.inn: {
                setInn(value);
                break;
            }
            case InputID.address: {
                setAddress(value);
                break;
            }
        }
    }, [])

    return (
        <div className={styles['organisation-data']}>
            <div className={styles['data-item']}>
                <div className={styles['inputs']}>
                    <div className={styles['key']}>Название</div>
                    <Input
                        value={name}
                        onChange={(e) => onInputChange(e, InputID.name)}
                        rootClassName={styles['value']}
                        size="middle"
                        placeholder="ООО <Название компании>"
                        allowClear
                        disabled={disabled}
                    />
                </div>
                <div className={classNames(
                    styles['inputs'],
                    styles['_second']
                )}>
                    <div className={styles['key']}>ИНН</div>
                    <Input
                        value={inn}
                        onChange={(e) => onInputChange(e, InputID.inn)}
                        rootClassName={styles['value']}
                        size="middle"
                        placeholder="1234567890"
                        allowClear
                        disabled={disabled}
                    />
                </div>
            </div>
            <div className={styles['data-item']}>
                <div className={styles['inputs']}>
                    <div className={styles['key']}>Адрес</div>
                    <Input
                        value={address}
                        onChange={(e) => onInputChange(e, InputID.address)}
                        rootClassName={styles['value']}
                        size="middle"
                        placeholder="Индекс, город, улица, номер дома, помещение"
                        allowClear
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    )
}

export default ManualForm;