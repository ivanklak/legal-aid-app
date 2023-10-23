import React from "react";
import { Quill } from "react-quill";
import styles from "./TextEditor.module.sass";
import classNames from "classnames";

// Custom Undo button icon component for Quill editor. You can import it directly
// from 'quill/assets/icons/undo.svg' but I found that a number of loaders do not
// handle them correctly
const CustomUndo = () => (
    <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
<path
    className="ql-stroke"
d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9"
    />
    </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
    <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
<path
    className="ql-stroke"
d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5"
    />
    </svg>
);

// Undo and redo functions for Custom Toolbar
function undoChange() {
    this.quill.history.undo();
}
function redoChange() {
    this.quill.history.redo();
}

export const modules = {
    toolbar: {
        container: "#toolbar",
    }
};

// Formats objects for setting up the Quill editor
export const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "align",
    "list",
    "bullet",
    "link",
    "image",
    "color",
]

// Quill Toolbar component
export const EditorToolbar = () => (
    <div id="toolbar" className={styles['editor-toolbar']}>
        <span className={classNames(
            "ql-formats",
            styles['text-title']
        )}>
          <select className="ql-header" defaultValue="5">
            <option value="3">Заголовок 1</option>
            <option value="4">Заголовок 2</option>
            <option value="5">Обычный текст</option>
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
        </span>
        <span className="ql-formats">
          <select className="ql-align" />
          <select className="ql-color" />
        </span>
        <span className="ql-formats">
          <button className="ql-link" />
          <button className="ql-image" />
          <button className="ql-video" />
        </span>
        <span className="ql-formats">
          <button className="ql-clean" />
        </span>
    </div>
);

export default EditorToolbar;