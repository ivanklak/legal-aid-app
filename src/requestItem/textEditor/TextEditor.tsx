import React, {memo, useCallback, useState} from "react";
import styles from "./TextEditor.module.sass";
import ReactQuill, {UnprivilegedEditor} from "react-quill";
import {Button, UploadFile} from "antd";
import EditorToolbar, {formats, modules} from "./EditorToolbar";
import {DeltaStatic, Sources} from "quill";
import UploadFiles from "../../components/uploadFilesNew/UploadFiles";

interface TextEditorProps {
    saveComment: (text: string) => void;
}

const TextEditor = memo<TextEditorProps>(({saveComment}) => {
    const [editorValue, setEditorValue] = useState<string>('');
    const [editorActive, setEditorActive] = useState<boolean>(false);
    const [addedFiles, setAddedFiles] = useState<UploadFile[]>([]);

    const handleChangeValue = useCallback((value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
        const currentLength = editor.getLength();
        setEditorValue(value);
        if (currentLength <= 1) {
            setEditorActive(false);
        } else {
            setEditorActive(true);
        }
    }, [])

    const handleSendClick = useCallback(() => {
        saveComment(editorValue);
        console.log('=== send new comment ===', editorValue);
        console.log('=== addedFiles ===', addedFiles)
    }, [editorValue, addedFiles])

    const handleCancelClick = useCallback(() => {
        // close editor
        setEditorValue('');
        setEditorActive(false);
    }, [])

    const handleEditorFocus = useCallback(() => {
        setEditorActive(true)
    }, [])

    const handleFilesChanged = useCallback((files: UploadFile[]) => {
        setAddedFiles(files);
    }, [])

    return (
        <>
            <EditorToolbar />
            <ReactQuill
                onFocus={handleEditorFocus}
                className={styles.textEdit}
                theme="snow"
                value={editorValue}
                onChange={handleChangeValue}
                placeholder="Добавить комментарий..."
                formats={formats}
                modules={modules}
            />
            <UploadFiles onFilesChanged={handleFilesChanged} />
            {editorActive && (
                <div className={styles.controls}>
                    <Button
                        type="primary"
                        size="middle"
                        onClick={handleSendClick}
                    >
                        Отправить
                    </Button>
                    <Button
                        type="default"
                        size="middle"
                        onClick={handleCancelClick}
                    >
                        Отмена
                    </Button>
                </div>
            )}
        </>
    )
})

export default TextEditor