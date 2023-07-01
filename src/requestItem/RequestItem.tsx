import React, {useEffect} from "react";
import {useParams} from "react-router";
import {instance} from "../api.config";
import CenterContent from "../components/centerContent/CenterContent";
import MainWrapper from "../components/mainWrapper/MainWrapper";
import styles from "./RequestItem.module.sass";
import ClaimActions from "./claimActions/ClaimActions";

const CAPTION = 'Читос или кузя лакомкин?';
const ITEM_DESCRIPTION = 'Многие меня спрашивают читос или кузя лакомкин. Скажу по секрету, что между ними стоит еще один титан. Это русская картошка. ' +
    'Базарю. Под пивас вообще четко залетает, тает во рту, каеф. Будто девчонку первый раз попробовал. И к слову жизнь как рюкзак нагруженный пивом - чем больше пьешь пиво тем тебе легче. Главное перед мамой не спалиться'

const RequestItem = () => {
    const {id} = useParams();

    useEffect(() => {
        requestClaimDetails();
    }, [])

    const requestClaimDetails = async () => {
        try {
            const response = await instance.post('/claims_details',
                { id: id },
                { headers: {'Content-Type': 'application/json'} }
            );

            if (response) {
                console.log('claim details response', response)
            }
        } catch (err) {
            console.log('getting claim details error', err)
        }
    }


    return (
        <MainWrapper>
            <CenterContent>
                <div className={styles.main_info}>
                    <div className={styles.form}>
                        <div className={styles.caption}>{CAPTION}</div>
                        <div className={styles.description}>Описание</div>
                        <div className={styles.description_text}>{ITEM_DESCRIPTION}</div>
                        <div className={styles.attachments}>Вложения</div>
                        <div className={styles.attachment_items}>
                            <div className={styles.attach_item}>
                                .doc
                            </div>
                            <div className={styles.attach_item}>
                                .pdf
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <div className={styles.title}>Активность</div>
                         <ClaimActions id={id}/>
                    </div>
                </div>
                <div className={styles.additional_info}>
                    {id}
                </div>
            </CenterContent>
        </MainWrapper>
    )
}
export default RequestItem;