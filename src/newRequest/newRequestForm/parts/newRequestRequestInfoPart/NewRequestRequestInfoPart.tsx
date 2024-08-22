import React, {memo} from "react";
import styles from "./NewRequestRequestInfoPart.module.sass";
import Button from "../../../../controls/button/Button";

interface NewRequestRequestInfoPartProps {
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
}

const CAPTION = 'Обращение';

const NewRequestRequestInfoPart = memo<NewRequestRequestInfoPartProps>(({onPrevPageClick, onNextPageClick}) => {
    return (
        <div className={styles['request-info']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            <div>тут что-то буит</div>
            <div className={styles['buttons']}>
                <Button onClick={onPrevPageClick} className={styles['back-btn']}>Назад</Button>
                <Button onClick={onNextPageClick} className={styles['next-btn']}>Далее</Button>
            </div>
        </div>
    )
})

export default NewRequestRequestInfoPart;