import React, {FC, useCallback, useEffect, useState} from "react";
import styles from "./ManualForm.module.sass";
import {Button, Input} from "antd";
import {ISuggestions} from "../api/requests/GetOrganisationSuggestionsRequest";
import {AiOutlineRest} from "react-icons/ai";

enum InputID {
    name,
    inn,
    kpp,
    address
}

interface SaveData {
    name: string;
    inn: string;
    kpp: string;
    address: string;
}

interface ManualFormProps {
    selectedOrganisation?: ISuggestions
    saveOrganisationData: (data: SaveData) => void
}

const ManualForm: FC<ManualFormProps> = ({selectedOrganisation, saveOrganisationData}) => {
    const [name, setName] = useState<string>(selectedOrganisation ? selectedOrganisation.value : '');
    const [inn, setInn] = useState<string>(selectedOrganisation ? selectedOrganisation.data.inn : '');
    const [kpp, setKpp] = useState<string>(selectedOrganisation ? selectedOrganisation.data.kpp : '');
    const [address, setAddress] = useState<string>(selectedOrganisation ? selectedOrganisation.data.address.value :'');

    useEffect(() => {
        setName(selectedOrganisation ? selectedOrganisation.value : '');
        setInn(selectedOrganisation ? selectedOrganisation.data.inn : '');
        setKpp(selectedOrganisation ? selectedOrganisation.data.kpp : '');
        setAddress(selectedOrganisation ? selectedOrganisation.data.address.value : '');
    }, [selectedOrganisation])

    const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, id: InputID) => {
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
            case InputID.kpp: {
                setKpp(value);
                break;
            }
            case InputID.address: {
                setAddress(value);
                break;
            }
        }
    }, [])

    // очистка всех полей
    const clearHandle = useCallback(() => {
        setName('');
        setInn('');
        setKpp('');
        setAddress('');
    }, [])

    const submitHandle = useCallback(() => {
        saveOrganisationData({name, inn, kpp, address})
    }, [address, inn, kpp, name, saveOrganisationData])

    return (
        <div className={styles.manualContainer}>
            <Input onChange={(e) => onInputChange(e, InputID.name)} value={name} addonBefore={"Название"} allowClear />
            <div className={styles.manualRow}>
                <Input onChange={(e) => onInputChange(e, InputID.inn)} value={inn} addonBefore={"ИНН"} allowClear />
                <Input onChange={(e) => onInputChange(e, InputID.kpp)} value={kpp} addonBefore={"КПП"} allowClear />
            </div>
            <Input onChange={(e) => onInputChange(e, InputID.address)} value={address} addonBefore={"Юр. адрес"} allowClear />
            <div className={styles.buttonsContainer}>
                <Button icon={<AiOutlineRest size="20" />} onClick={clearHandle} />
                <Button type="primary" onClick={submitHandle}>Подтвердить</Button>
            </div>
        </div>
    )
}

export default ManualForm;