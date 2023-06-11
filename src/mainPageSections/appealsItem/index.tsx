import React, {FC} from 'react';
import styles from "./AppealsItem.module.css";
import {IAppeals, Status} from "../mainPage/MainPage";
import {HiOutlineBuildingLibrary} from "react-icons/hi2";

interface IAppealsItemProps {
    item: IAppeals
}

const AppealsItem: FC<IAppealsItemProps> = ({ item }) => {
    return (
        <div className={styles.appealsItem}>
            <div className={styles.appealsContainer}>
                <div className={styles.itemData}>
                    <div className={styles.itemId}>{`№ ${item.id}`}</div>
                    <div className={styles.itemDate}>{item.date}</div>
                </div>
                <div className={styles.itemIcon}>
                    <div className={styles.iconContainer}>
                        <HiOutlineBuildingLibrary size={20} />
                    </div>
                </div>
                <div className={styles.itemDescription}>
                    <div className={styles.itemTitle}>{item.title}</div>
                    <div className={styles.itemShortDescription}>{item.shortDescription}</div>
                </div>
                <div className={styles.itemStatus}>
                    {item.status === Status.success && <div className={styles.itemSuccessStatus}>{item.status}</div>}
                    {item.status === Status.inProcess && <div className={styles.itemInProcessStatus}>{item.status}</div>}
                    {item.status === Status.sent && <div className={styles.itemSentStatus}>{item.status}</div>}
                    {item.status === Status.verification && <div className={styles.itemVerificationStatus}>{item.status}</div>}
                    {item.status === Status.waitingForAction && <div className={styles.itemWaitingForAction}>{item.status}</div>}
                </div>
            </div>
        </div>
    )
}

export default AppealsItem;