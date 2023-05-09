import React, {FC, useCallback, useState} from "react";
import styles from "./ClientProblem.module.sass";
import {Input as DefaultInput, InputSize} from "../../components/input";
import classNames from "classnames";
import UploadFiles from "../../components/uploadFiles/UploadFiles";
import {AutoComplete, Input} from 'antd';
import getOrganisationSuggestionsRequest from "../api/methods/getOrganisationSuggestionsRequest";
import {ISuggestions} from "../api/requests/GetOrganisationSuggestionsRequest";

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
    const [options, setOptions] = useState<ISuggestionOptions[]>([]);

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

    const renderTitle = (title: string) => (
        <span>
            {title}
            {/*<a*/}
            {/*    style={{ float: 'right' }}*/}
            {/*    href="https://www.google.com/search?q=antd"*/}
            {/*    target="_blank"*/}
            {/*    rel="noopener noreferrer"*/}
            {/*>*/}
            {/*more*/}
            {/*</a>*/}
      </span>
    );

    // TODO сделать новые поля
    const enterDataManually = () => {
        console.log('enter data manually => display new fields')
    }

    const renderErrorTitle = (title: string) => (
        <span>
            {title}
            <span  style={{ float: 'right', color: "var(--base-color__button)", cursor: "pointer" }} onClick={enterDataManually}>
                Ввести данные вручную
            </span>
        </span>
    )

    const renderItem = (item: ISuggestions) => ({
        value: item.value,
        label: (
            <div key={item.value}>
                <div>{item.value}</div>
                <div>{item.data.inn}</div>
                <div>{item.data.address.value}</div>
            </div>
        ),
    });

    // переводим данные с сервера в опции для показа
    const setSuggestionsInOptions = useCallback((suggestions: ISuggestions[]) => {
        if (!suggestions.length) {
            setOptions([{label: renderErrorTitle('Ничего не найдено')}])
            return
        }
        const suggestionsOptions = suggestions.map((item) => renderItem(item))
        const result = {
            label: renderTitle('Организации'),
            options: suggestionsOptions,
        }
        setOptions([result])
    }, [renderErrorTitle])

    // поиск организаций (подсказок)
    const searchHandle = useCallback((value: string) => {
        getOrganisationSuggestionsRequest(value)
            .then((res) => {
                console.log('res', res.suggestions)
                setSuggestionsInOptions(res.suggestions)
            })
            .catch((err) => {
                console.log('error', err)
                setOptions([{label: renderErrorTitle('Произошла ошибка')}])
            })
    }, [renderErrorTitle, setSuggestionsInOptions])

    // реакция на выбор организации
    const onSelect = (value: string) => {
        //TODO save data to send it
        console.log('onSelect', value);
    };

    return (
        <>
            <div className={styles.title}>Обращение</div>
            <div className={styles.problemForm}>
                <div className={styles.descriptionContainer}>
                    <div className={styles.organization}>
                        <div className={styles.subTitle}>Организация</div>
                        <AutoComplete
                            dropdownMatchSelectWidth={500}
                            options={options}
                            style={{ display: 'block' }}
                            onSelect={onSelect}
                            // onSearch={searchHandle}
                        >
                            <Input.Search
                                disabled={disabled}
                                loading={false}
                                onSearch={searchHandle}
                                size="middle"
                                placeholder="Введите название, ИНН или ОГРН"
                            />
                        </AutoComplete>
                    </div>
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