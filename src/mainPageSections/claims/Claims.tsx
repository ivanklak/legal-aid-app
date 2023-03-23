import React, {FC, useEffect} from "react";
import {IAppeals} from "../mainPage/MainPage";
import styles from "./Claims.module.css";
import AppealsItem from "../appealsItem";
import {useNavigate} from "react-router-dom";
import axios from "../../service/api/axios";

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
            {id: 290},
            {
                headers: {'Content-Type': 'application/json'}
        });

        const response2 = await axios.post('/get_claims',
            {
                headers: {'Content-Type': 'application/json'}
            });

        console.log('response', response)
        console.log('response2', response2)
    }

    useEffect( () => {
        requestClaims();
    }, [])

    return (
        <div className={styles.claims}>
            {claims.map((item) => (
                <AppealsItem item={item} key={item.id} />
            ))}
            <div className={styles.allAppeals} onClick={onAllAppealsClick}>Все обращения</div>
        </div>
    )
}

export default Claims