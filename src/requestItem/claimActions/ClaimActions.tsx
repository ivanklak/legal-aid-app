import React, {memo, useEffect, useState} from "react";
import styles from "./ClaimActions.module.sass";
import {BsPersonFill} from "react-icons/bs";
import {IComment} from "../../mainPageSections/api/requests/GetClaimsRequest";

interface IClaimAction {
    id: string;
    isSystem?: boolean;
    text: string;
    from?: string;
    date: string;
}

interface ClaimActionsProps {
    id: string;
    actions: IComment[];
}

const markdownText = '<h2>Уважаемый Членни Станогий,</h2><p><br></p><p>информирую вас о том, что ваша длина составляет 5 см. </p><p><br></p><p>С уважением, </p><p>Клиника измерения членов</p>'

const mockActions: IClaimAction[] = [
    {id: '0', isSystem: true, text: 'Статус обращения обновлен', date: '01.07.2023 10:20'},
    {id: '1', text: 'Ваше обращение принято. Спасибо за доверие.', from: 'Роспотребнадзор', date: '01.07.2023 11:07'},
    {id: '2', text: 'Уважаемый Пувел Диареевич, информируем вас о том, что срок рассотрения вашего обращения продлен из-за большой загрузки. Спасибо за понимание.', from: 'Роспотребнадзор', date: '01.07.2023 13:34'},
]

const ClaimActions = memo<ClaimActionsProps>(({id, actions}) => {

    const getDate = (dateString: string): string => {
        if (!dateString) return null;

        const dateArray = dateString.split('T');
        const [year, month, day] = dateArray[0].split('-');
        const hoursPart = dateArray[1].split('.');

        const [hours, minutes, seconds] = hoursPart[0].split(':');

        return `${day}.${month}.${year} ${hours}:${minutes}`
    }

    const renderActions = () => {
        if (!actions || !actions.length) return <div>no data</div>

        const actionsElements = actions.map((action) => (
            <div key={action.id} className={styles.action_item}>
                <div className={styles.item_from_icon_container}>
                   <div className={styles.icon}>
                       <BsPersonFill color={'white'} />
                   </div>
                </div>
                <div className={styles.item_main_container}>
                    <div className={styles.item_header}>
                        <div className={styles.item_from}>{action.user.first_name}</div>
                        <div className={styles.item_date}>{getDate(action.createdAt)}</div>
                    </div>
                    {/*<div className={styles.item_text}>{action.text}</div>*/}
                    <div className={styles.item_text} dangerouslySetInnerHTML={{__html: action.text}} />
                </div>
            </div>
        ))

        return (
            <div className={styles.actions_container}>{actionsElements}</div>
        )
    }

    return renderActions()

})

export default ClaimActions;