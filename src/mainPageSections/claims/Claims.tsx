import React, {FC, useEffect} from "react";
import {IAppeals} from "../mainPage/MainPage";
import styles from "./Claims.module.css";
import AppealsItem from "../appealsItem";
import {useNavigate} from "react-router-dom";
import axios from "../../service/api/axios";
import {BsArrowDownShort} from "react-icons/bs";

interface IClaims {
    claims: IAppeals[]
}

const Claims: FC<IClaims> = ({claims}) => {
    const navigate = useNavigate();

    const onAllAppealsClick = () => {
        return navigate('myRequests')
    }

    const requestClaims = async () => {
        const response = await axios.post('/get_claims_details',
            { id: 290 },
            { headers: {'Content-Type': 'application/json'} }
        );

        const response2 = await axios.post('/get_claims', { headers: {'Content-Type': 'application/json'} });

        console.log('response', response)
        console.log('response2', response2)
    }

    useEffect( () => {
        requestClaims();
    }, [])

    return (
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