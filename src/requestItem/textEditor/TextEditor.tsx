import React, {memo, useCallback, useEffect, useMemo, useState} from "react";
import styles from "./TextEditor.module.sass";
import ReactQuill, {UnprivilegedEditor} from "react-quill";
import {Button, UploadFile} from "antd";
import EditorToolbar, {formats, modules} from "./EditorToolbar";
import {DeltaStatic, Sources} from "quill";
import UploadFiles from "../../components/uploadFilesNew/UploadFiles";
import classNames from "classnames";
import {useDraftCreatorContext} from "../../newRequest/DraftCreator";

interface TextEditorProps {
    onChange?: (text: string, files?: UploadFile[]) => void;
    saveComment?: (text: string, files?: UploadFile[]) => void;
    placeHolder?: string;
    toolBarClassName?: string;
    editTextClassName?: string;
    showButtons?: boolean;
    clean?: boolean;
}

const TextEditor = memo<TextEditorProps>(({onChange, saveComment, placeHolder, toolBarClassName, editTextClassName, showButtons, clean}) => {
    const [editorValue, setEditorValue] = useState<string>('');
    const [editorActive, setEditorActive] = useState<boolean>(false);
    const [addedFiles, setAddedFiles] = useState<UploadFile[]>([]);

    const {createOrEditDraft} = useDraftCreatorContext();

    useEffect(() => {
        if (clean) {
            setEditorValue('');
            setEditorActive(false);
            setAddedFiles([]);
        }
    }, [clean])

    const needToShowButtons = useMemo<boolean>(() => {
        return showButtons === undefined || showButtons === true;
    }, [showButtons])

    const handleChangeValue = useCallback((value: string, delta: DeltaStatic, source: Sources, editor: UnprivilegedEditor) => {
        setEditorValue(value);
        const currentLength = editor.getLength();
        if (currentLength <= 1) {
            setEditorActive(false);
            onChange('', addedFiles);
        } else {
            setEditorActive(true);
            onChange(value, addedFiles);
            localStorage.setItem("claim.draft.text", JSON.stringify(value));
        }
    }, [addedFiles, onChange])

    const handleSendClick = useCallback(() => {
        saveComment && saveComment(editorValue, addedFiles);
    }, [saveComment, editorValue, addedFiles])

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
        onChange(editorValue === '<p><br></p>' ? '' : editorValue, files);
        localStorage.setItem("claim.draft.files", JSON.stringify(files));
    }, [editorValue, onChange])

    const saveInDraft = useCallback(() => {
        // сохраняем в черновик
        !!editorValue && editorValue !== '<p><br></p>' && createOrEditDraft({text: editorValue});
    }, [editorValue])

    return (
        <>
            <EditorToolbar className={toolBarClassName} />
            <ReactQuill
                onFocus={handleEditorFocus}
                className={classNames(
                    styles.textEdit,
                    editTextClassName
                )}
                theme="snow"
                value={editorValue}
                onChange={handleChangeValue}
                placeholder={placeHolder ? placeHolder : 'Добавить комментарий...'}
                formats={formats}
                modules={modules}
                onBlur={saveInDraft}
            />
            <UploadFiles clean={clean} onFilesChanged={handleFilesChanged} />
            {needToShowButtons && editorActive && (
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