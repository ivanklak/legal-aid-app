import React, {FC, useCallback, useState} from "react";
import styles from "./ClientProblem.module.sass";
import {Input as DefaultInput, InputSize} from "../../components/input";
import classNames from "classnames";
import UploadFiles from "../../components/uploadFiles/UploadFiles";
import SearchOrganisationForm from "../organisation/searchOrganisation/SearchOrganisationForm";

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

const ClientProblemData: FC<ClientProblemDataProps> = ({disabled, onSubmitForm}) => {
    const [category, setCategory] = useState<string>(null);
    const [textAreaValue, setTextAreaValue] = useState<string>(null);

    const [success, setSuccess] = useState<boolean>(false);

    const [error, setError] = useState<string>(null);

    const textAreaChangeHandle = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setSuccess(false);
        setError(null);

        if (!!e.target.value) {
            setTextAreaValue(e.target.value)
        } else {
            setTextAreaValue(null);
            onSubmitForm(false);
        }
    }, [onSubmitForm])

    const inputChangeHandle = useCallback((value: string) => {
        setSuccess(false);
        setError(null);
        setCategory(value);
    }, [])

    const submitHandle = useCallback(() => {
        if (!!category && !!textAreaValue) {
            onSubmitForm(true);
            setSuccess(true);
        } else {
            setSuccess(false);
            setError('Пожалуйста заполните все поля');
            onSubmitForm(false);
        }
    }, [category, textAreaValue, onSubmitForm])

    const onSearchOrganisationSubmit = () => {
        console.log('onSearchOrganisationSubmit')
    }

    return (
        <>
            <div className={styles.title}>Обращение</div>
            <div className={styles.problemForm}>
                <div className={styles.descriptionContainer}>
                    <SearchOrganisationForm submitSearchOrganisation={onSearchOrganisationSubmit} />
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
                    <div className={styles.subTitle}>Вложение</div>
                    <UploadFiles />
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
            </div>
        </>
    )
}

export default ClientProblemData;