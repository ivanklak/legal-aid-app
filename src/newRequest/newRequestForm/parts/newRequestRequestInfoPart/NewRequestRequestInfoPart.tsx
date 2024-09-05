import React, {memo, useCallback, useEffect, useState} from "react";
import styles from "./NewRequestRequestInfoPart.module.sass";
import Button from "../../../../controls/button/Button";
import TextEditor from "../../../../requestItem/textEditor/TextEditor";
import classNames from "classnames";
import {UploadFile} from "antd";
import {useSafeNewRequestDataLayerContext} from "../../../NewRequestDataLayer";
import {Input, InputSize} from "../../../../components/input";

interface NewRequestRequestInfoPartProps {
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
}

const CAPTION = 'Обращение';

const NewRequestRequestInfoPart = memo<NewRequestRequestInfoPartProps>(({onPrevPageClick, onNextPageClick}) => {
    const {
        reason,
        claimText,
        setClaimText,
        files: filesGlobal,
        setFiles: setFilesGlobal
    } = useSafeNewRequestDataLayerContext();

    const [descriptionText, setDescriptionText] = useState<string>(claimText ? claimText : '');
    const [files, setFiles] = useState<UploadFile[]>(filesGlobal ? filesGlobal : []);
    const [error, setError] = useState<string>('');
    const [linkValue, setLinkValue] = useState<string>('');

    useEffect(() => {
        setClaimText(descriptionText);
        setFilesGlobal(files);
    }, [descriptionText, files, setClaimText, setFilesGlobal])

    const handleChangeTextEditor = useCallback((text: string, files: UploadFile[]) => {
        setDescriptionText(text);
        setFiles(files);
        setError('');
    }, [])

    const onLinkInputChange = (value: string) => {
        setLinkValue(value)
    }

    const renderContentByReasonId = () => {
        switch (reason.id) {
            case 3: {
                return (
                    <>
                        <div className={styles['description-caption']}>Ссылка на товар или услугу</div>
                        <Input
                            value={linkValue}
                            style={{marginBottom: '12px'}}
                            placeholder={'https://example.com'}
                            tabIndex={0}
                            onChange={onLinkInputChange}
                            size={InputSize.Medium}
                            name='link'
                        />
                    </>
                )
            }
        }
    }

    return (
        <div className={styles['request-info']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            <div className={styles['description']}>
                {renderContentByReasonId()}
                <div className={styles['description-caption']}>Текст обращения</div>
                <TextEditor
                    value={descriptionText}
                    files={files}
                    onChange={handleChangeTextEditor}
                    placeHolder='Используйте меню выше чтобы форматировать описание'
                    showButtons={false}
                    toolBarClassName={styles['editor-tool-bar']}
                    editTextClassName={classNames(
                        styles['editor-edit-text'],
                        // isTextError && styles['_red']
                    )}
                    withDraft={true}
                />
            </div>
            <div className={styles['buttons']}>
                <Button onClick={onPrevPageClick} className={styles['back-btn']}>Назад</Button>
                <Button disabled={!descriptionText} onClick={onNextPageClick} className={styles['next-btn']}>Далее</Button>
            </div>
        </div>
    )
})

export default NewRequestRequestInfoPart;