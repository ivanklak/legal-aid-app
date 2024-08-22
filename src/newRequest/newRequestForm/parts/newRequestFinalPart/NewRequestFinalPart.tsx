import React, {memo} from "react";
import styles from "./NewRequestFinalPart.module.sass";
import Button from "../../../../controls/button/Button";

interface NewRequestFinalPartProps {
    onPrevPageClick: () => void;
}

const CAPTION = 'Ваше обращение';

const NewRequestFinalPart = memo<NewRequestFinalPartProps>(({onPrevPageClick}) => {
    return (
        <div className={styles['final']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            <div>тут будет итог всего обращение</div>
            <div className={styles['buttons']}>
                <Button onClick={onPrevPageClick} className={styles['back-btn']}>Назад</Button>
                <Button onClick={() => {console.log('Отправлено')}} className={styles['send-btn']}>Отправить</Button>
            </div>
        </div>
    )
})

export default NewRequestFinalPart;