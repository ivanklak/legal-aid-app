import React, {FC, useCallback, useState} from "react";
import styles from "./ClientProblem.module.sass";
import {Input as DefaultInput, InputSize} from "../../designSystem/input";
import classNames from "classnames";
import UploadFiles from "../../components/uploadFiles/UploadFiles";
import SearchOrganisationForm from "../organisation/searchOrganisation/SearchOrganisationForm";
import {Button} from "antd";
import {useSafeNewRequestDataLayerContext} from "../NewRequestDataLayer";

interface ClientProblemDataProps {
    disabled: boolean
    onSubmitForm: (success: boolean) => void
}

interface IOptions {
    value: string
    label: JSX.Element
}

interface ISuggestionOptions {
    label: JSX.Element
    options?: IOptions[]
}

export interface SavedOrgData {
    name: string;
    inn: string;
    kpp: string;
    address: string;
}

const ClientProblemData: FC<ClientProblemDataProps> = ({disabled, onSubmitForm}) => {
    const {setClaimTitle, setClaimText} = useSafeNewRequestDataLayerContext();

    const [category, setCategory] = useState<string>(null);
    const [textAreaValue, setTextAreaValue] = useState<string>(null);

    const [success, setSuccess] = useState<boolean>(false);
    const [orgData, setOrgData] = useState<SavedOrgData>(null);
    const [error, setError] = useState<string>(null);

    const textAreaChangeHandle = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSuccess(false);
        setError(null);

        if (!!e.target.value) {
            setTextAreaValue(e.target.value);
            setClaimText(e.target.value);
        } else {
            setTextAreaValue(null);
            setClaimText('');
            onSubmitForm(false);
        }
    }, [onSubmitForm])

    const inputChangeHandle = useCallback((value: string) => {
        setSuccess(false);
        setError(null);
        setCategory(value);
        setClaimTitle(value);
    }, [])

    const submitHandle = useCallback(() => {
        if (!!category && !!textAreaValue && !!orgData) {
            onSubmitForm(true);
            setSuccess(true);
            //TODO тут нужно сделать переход к результирующей странице
        } else {
            setSuccess(false);
            setError('Пожалуйста заполните все поля');
            onSubmitForm(false);
        }
    }, [category, textAreaValue, orgData, onSubmitForm])

    const onSearchOrganisationSubmit = (data: SavedOrgData) => {
        console.log('data to be send', data)
        setOrgData(data)
    }

    return (
        <>
            <div className={styles.title}>Обращение</div>
            <div className={styles.problemForm}>
                <div className={styles.descriptionContainer}>
                    <SearchOrganisationForm disabled={disabled} submitSearchOrganisation={onSearchOrganisationSubmit} />
                    <div className={styles.resume}>
                        <div className={styles.subTitle}>Резюме</div>
                        <DefaultInput
                            value={category}
                            placeholder={''}
                            tabIndex={0}
                            onChange={inputChangeHandle}
                            error={null}
                            size={InputSize.Medium}
                            name={'client_category'}
                            disabled={disabled}
                        />
                    </div>
                    <div className={styles.subTitle}>Описание</div>
                    <textarea
                        disabled={disabled}
                        className={styles.description}
                        value={textAreaValue ? textAreaValue : ''}
                        onChange={textAreaChangeHandle}
                    />
                    <div className={styles.subTitle}>Вложения</div>
                    <UploadFiles />
                    <div className={styles.submitBlock}>
                        <div className={styles.error}>{error}</div>
                        <Button type="primary" onClick={submitHandle}>Подтвердить</Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ClientProblemData;