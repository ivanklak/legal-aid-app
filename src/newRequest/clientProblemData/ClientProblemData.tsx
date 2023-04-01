import React, {FC, useCallback, useState} from "react";
import styles from "./ClientProblem.module.sass";
import {Input, InputSize} from "../../components/input";
import classNames from "classnames";
import UploadFiles from "../../components/uploadFiles/UploadFiles";

interface ClientProblemDataProps {
    disabled: boolean
    onSubmitForm: (success: boolean) => void
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

    return (
        <>
            <div className={styles.title}>Обращение</div>
            <div className={styles.problemForm}>
                <div className={styles.descriptionContainer}>
                    {/*TODO изменить на дропдаун*/}
                    <div className={styles.category}>
                        <Input
                            value={category}
                            placeholder={'Категория'}
                            autoFocus
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