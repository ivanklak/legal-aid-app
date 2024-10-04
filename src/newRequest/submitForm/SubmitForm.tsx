import React, {memo, useCallback} from "react";
import styles from "./SubmitForm.module.sass";
import {Button} from "antd";
import {useSafeNewRequestDataLayerContext} from "../NewRequestDataLayer";
import {requestCreateNewClaim} from "../api/methods/requestCreateNewClaim";
import {useAuth} from "../../app/hooks/useAuth";
import {CreateNewClaimParams} from "../api/requests/PostCreateNewClaimRequest";

interface SubmitFormProps {
    error: string
}

const SubmitForm = memo<SubmitFormProps>(({error}) => {
    const { userData } = useAuth();
    const claimData = useSafeNewRequestDataLayerContext();

    const submitFullForm = useCallback(async () => {
        const sessionId = localStorage.getItem('id');

        const params: CreateNewClaimParams = {
            claimName: claimData.claimTitle,
            claimText: claimData.claimText,
            contentSum: "1500000",
            contentType: "Appeal",
            recipientAddress: 'claimData.organisationData.address',
            recipientEmail: "",
            recipientInn: 'claimData.organisationData.inn',
            recipientName: 'claimData.organisationData.name',
            sessionId: sessionId,
            file: null
        }
        const response = await requestCreateNewClaim(params);

        console.log('requestCreateNewClaim response', response)
    }, [])

    console.log('userData', userData)
    console.log('claimData', claimData)
    return (
        <div className={styles.sendForm}>
            <div className={styles.subTitle}>Ваше обращение будет рассмотрено нашими специалистами в ближайшее время.</div>
            <div className={styles.subTitle}>Вы будете получать уведомления о любых изменениях.</div>
            <div className={styles.buttonContainer}>
                <div className={styles.error}>{error}</div>
                <Button
                    type="primary"
                    onClick={submitFullForm}
                >
                    Отправить
                </Button>
            </div>
        </div>
    )
})

export default SubmitForm;