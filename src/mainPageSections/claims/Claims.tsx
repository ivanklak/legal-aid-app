import React, {FC} from "react";
import {IAppeals} from "../mainPage/MainPage";
import styles from "./Claims.module.css";
import AppealsItem from "../appealsItem";
import {useNavigate} from "react-router-dom";

interface IClaims {
    claims: IAppeals[]
}

const Claims: FC<IClaims> = ({claims}) => {
    const navigate = useNavigate();

    const onAllAppealsClick = () => {
        return navigate('myRequests')
    }

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