import React, {memo, useState} from "react";
import styles from "./NewRequestReasonPart.module.sass";
import classNames from "classnames";
import Button from "../../../../designSystem/button/Button";
import {useSafeNewRequestDataLayerContext} from "../../../NewRequestDataLayer";

interface NewRequestReasonPartProps {
    onNextPageClick: () => void;
}

const CAPTION = 'Причина обращения';

type ReasonId = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface IReason {
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
    const {reason, setReason} = useSafeNewRequestDataLayerContext();
    const [selectedReasonId, setSelectedReasonId] = useState<ReasonId>(reason?.id || null);

    const handleSelectReason = (item: IReason) => {
        if (item.id === selectedReasonId) {
            setSelectedReasonId(null);
            setReason(null);
            return;
        }

        setSelectedReasonId(item.id);
        setReason(item);
    }

    return (
        <div className={styles['reason-part']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            <div>Описание подраздела Описание подраздела Описание подраздела Описание подраздела Описание подраздела Описание подраздела Описание подраздела</div>
            {reasons.map((item) => (
                <div
                    key={item.id}
                    className={classNames(
                        styles['reason-item'],
                        item.id === selectedReasonId && styles['_selected']
                    )}
                    onClick={() => handleSelectReason(item)}
                >
                    {item.text}
                </div>
            ))}
            <div className={styles['buttons']}>
                <Button disabled={!selectedReasonId} onClick={onNextPageClick}>Далее</Button>
            </div>
        </div>
    )
})

export default NewRequestReasonPart;