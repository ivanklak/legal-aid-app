import React, {memo, useEffect, useState} from "react";
import styles from "./ClaimActions.module.sass";
import {BsPersonFill} from "react-icons/bs";

interface IClaimAction {
    id: string;
    isSystem?: boolean;
    text: string;
    from?: string;
    date: string;
}

interface ClaimActionsProps {
    id: string
}

const mockActions: IClaimAction[] = [
    {id: '0', isSystem: true, text: 'Статус обращения обновлен', date: '01.07.2023 10:20'},
    {id: '1', text: 'Ваше обращение принято. Спасибо за доверие.', from: 'Роспотребнадзор', date: '01.07.2023 11:07'},
    {id: '2', text: 'Уважаемый Пувел Диареевич, информируем вас о том, что срок рассотрения вашего обращения продлен из-за большой загрузки. Спасибо за понимание.', from: 'Роспотребнадзор', date: '01.07.2023 13:34'},
]

const ClaimActions = memo<ClaimActionsProps>(({id}) => {
    const [actions, setActions] = useState<IClaimAction[]>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        requestClaimActions()
    }, [])

    const requestClaimActions = async () => {
        setLoading(true);
        try {
            // пример
            // const response = await instance.post(`/claim_actions?id=${id}`)
            const response = true;
            if (response) {
                setActions(mockActions);
                setLoading(false);
            }
        } catch (err) {
            console.log('getting claim actions error', err)
            setLoading(false);
        }
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
                        {!action.isSystem && <div className={styles.item_from}>{action.from}</div>}
                        <div className={styles.item_date}>{action.date}</div>
                    </div>
                    <div className={styles.item_text}>{action.text}</div>
                </div>
            </div>
        ))

        return (
            <div className={styles.actions_container}>{actionsElements}</div>
        )
    }

    const renderLoader = (): JSX.Element => {
        return <div>loading</div>
    }

    return loading ? renderLoader() : renderActions()

})

export default ClaimActions;