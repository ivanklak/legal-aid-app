import React, {memo, useCallback, useState} from "react";
import styles from "./TextEditor.module.sass";
import ReactQuill from "react-quill";
import {Button} from "antd";

interface TextEditorProps {}

const TextEditor = memo<TextEditorProps>(() => {
    const [editorValue, setEditorValue] = useState<string>('');

    const handleChangeValue = useCallback((val: string) => {
        setEditorValue(val);
    }, [])

    const handleSendClick = useCallback(() => {
        // api request
        console.log('=== send new comment ===', editorValue)
    }, [editorValue])

    const handleCancelClick = useCallback(() => {
        // close editor
        setEditorValue('');
    }, [])

    return (
        <>
            <ReactQuill
                className={styles.textEdit}
                theme="snow"
                value={editorValue}
                onChange={handleChangeValue}
            />
            <div className={styles.controls}>
                <Button
                    type="primary"
                    size="middle"
                    onClick={handleSendClick}
                >Отправить</Button>
                <Button
                    type="default"
                    size="middle"
                    onClick={handleCancelClick}
                >Отмена</Button>
            </div>
        </>
    )
})

export default TextEditor