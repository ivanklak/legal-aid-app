import React, {memo, useCallback, useEffect, useState} from "react";
import styles from "./NewRequestRequestInfoPart.module.sass";
import Button from "../../../../controls/button/Button";
import TextEditor from "../../../../requestItem/textEditor/TextEditor";
import classNames from "classnames";
import {UploadFile} from "antd";
import {useSafeNewRequestDataLayerContext} from "../../../NewRequestDataLayer";

interface NewRequestRequestInfoPartProps {
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
}

const CAPTION = 'Обращение';

const NewRequestRequestInfoPart = memo<NewRequestRequestInfoPartProps>(({onPrevPageClick, onNextPageClick}) => {
    const {
        claimText,
        setClaimText,
        files: filesGlobal,
        setFiles: setFilesGlobal
    } = useSafeNewRequestDataLayerContext();

    const [descriptionText, setDescriptionText] = useState<string>(claimText ? claimText : '');
    const [files, setFiles] = useState<UploadFile[]>(filesGlobal ? filesGlobal : []);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        setClaimText(descriptionText);
        setFilesGlobal(files);
    }, [descriptionText, files, setClaimText, setFilesGlobal])

    const handleChangeTextEditor = useCallback((text: string, files: UploadFile[]) => {
        setDescriptionText(text);
        setFiles(files);
        setError('');
    }, [])

    return (
        <div className={styles['request-info']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            <div className={styles['description']}>
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