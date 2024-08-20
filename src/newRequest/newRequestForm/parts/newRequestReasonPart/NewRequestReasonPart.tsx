import React, {memo, useState} from "react";
import styles from "./NewRequestReasonPart.module.sass";
import classNames from "classnames";
import Button from "../../../../controls/button/Button";

interface NewRequestReasonPartProps {
    onNextPageClick: () => void;
}

const CAPTION = 'Причина обращения';

type ReasonId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface IReason {
    id: ReasonId;
    text: string;
}

const reasons: IReason[] = [
    {id: 1, text: 'Неисполнение условий договора'},
    {id: 2, text: 'Обман и мошенничество'},
    {id: 3, text: 'Некачественный товар и услуга'},
    {id: 4, text: 'Незаконное удержание денежных средств'},
    {id: 5, text: 'Нарушение прав на персональные данные'},
    {id: 6, text: 'Проблемы с гарантийным обслуживанием'},
    {id: 7, text: 'Мои права были нарушены. Обращение в свободной форме'},
]

const NewRequestReasonPart = memo<NewRequestReasonPartProps>(({onNextPageClick}) => {
    const [selectedReasonId, setSelectedReasonId] = useState<ReasonId>(null);

    const handleSelectReason = (id: ReasonId) => {
        if (id === selectedReasonId) {
            setSelectedReasonId(null);
            return;
        }

        setSelectedReasonId(id);
    }

    return (
        <div className={styles['reason-part']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            {reasons.map((item) => (
                <div
                    key={item.id}
                    className={classNames(
                        styles['reason-item'],
                        item.id === selectedReasonId && styles['_selected']
                    )}
                    onClick={() => handleSelectReason(item.id)}
                >
                    {item.text}
                </div>
            ))}
            <div className={styles['buttons']}>
                <Button onClick={onNextPageClick}>Next</Button>
            </div>
        </div>
    )
})

export default NewRequestReasonPart;