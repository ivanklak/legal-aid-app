import React, {memo, useCallback, useState} from "react";
import styles from "./NewRequestRequestInfoPart.module.sass";
import Button from "../../../../controls/button/Button";
import TextEditor from "../../../../requestItem/textEditor/TextEditor";
import classNames from "classnames";
import {UploadFile} from "antd";

interface NewRequestRequestInfoPartProps {
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
}

const CAPTION = 'Обращение';

const NewRequestRequestInfoPart = memo<NewRequestRequestInfoPartProps>(({onPrevPageClick, onNextPageClick}) => {
    const [descriptionText, setDescriptionText] = useState<string>('');
    const [files, setFiles] = useState<UploadFile[]>([]);
    const [error, setError] = useState<string>('');

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
                <Button onClick={onNextPageClick} className={styles['next-btn']}>Далее</Button>
            </div>
        </div>
    )
})

export default NewRequestRequestInfoPart;