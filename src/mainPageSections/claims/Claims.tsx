import React, {FC, useEffect, useState} from "react";
import {IAppeals} from "../mainPage/MainPage";
import styles from "./Claims.module.css";
import AppealsItem from "../appealsItem";
import {useNavigate} from "react-router-dom";
import {BsArrowDownShort} from "react-icons/bs";
import getClaimsRequest from "../api/metods/getClaimsRequest";
import {ClaimsItemResponse} from "../api/requests/GetClaimsRequest";

const Claims: FC = () => {
    const navigate = useNavigate();
    const [claims, setClaims] = useState<ClaimsItemResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const onAllAppealsClick = () => {
        return navigate('myRequests')
    }

    const requestClaims = async () => {
        const sessionId = localStorage.getItem('id');
        if (!sessionId) return;
        setLoading(true);
        try {
            const response = await getClaimsRequest(sessionId);
            if (response) {
                console.log('res', response)
                setClaims(response.claims);
                setLoading(false);
            }
        } catch (err) {
            console.log('err')
            setLoading(false);
        }
        // const response = await axios.post('/claims_details',
        //     { id: 290 },
        //     { headers: {'Content-Type': 'application/json'} }
        // );
        // console.log('response', response)

        // const response2 = await axios.post('/claims', { headers: {'Content-Type': 'application/json'} });
    }

    useEffect( () => {
        requestClaims();
    }, [])

    console.log('claims', typeof claims)
    if (!claims.length) return null;

    return loading ? <div>loading</div> : (
        <>
            <div className={styles.sortBlock}>
                <div className={styles.sortTab}>Id обращения</div>
                <div className={styles.sortTab}>
                    <span className={styles.tabText}>Дата</span>
                    <BsArrowDownShort size={16} />
                </div>
                <div className={styles.sortTab}>Организация</div>
                <div className={styles.sortTab}>Статус</div>
            </div>
            <div className={styles.claims}>
                {claims.map((item) => (
                    <AppealsItem item={item} key={item.id} />
                ))}
                <div className={styles.allAppeals} onClick={onAllAppealsClick}>
                    <div className={styles.textButton}>
                        Все обращения
                    </div>
                </div>
            </div>
        </>
    )
}

export default Claims