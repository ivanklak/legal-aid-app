import React, {memo} from "react";
import styles from "./NewRequestUserDataPart.module.sass";
import Button from "../../../../controls/button/Button";

interface NewRequestUserDataPartProps {
    onPrevPageClick: () => void;
    onNextPageClick: () => void;
}

const CAPTION = 'Вход или регистрация';

const NewRequestUserDataPart = memo<NewRequestUserDataPartProps>(({onPrevPageClick, onNextPageClick}) => {
    return (
        <div className={styles['user-data']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            <div>тут что-то буит</div>
            <div className={styles['buttons']}>
                <Button onClick={onPrevPageClick}>Назад</Button>
                <Button onClick={onNextPageClick}>Далее</Button>
            </div>
        </div>
    )
})

export default NewRequestUserDataPart;