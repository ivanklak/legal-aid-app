import React, {FC} from 'react';
import styles from "./AppealsItem.module.css";
import {IAppeals, Status} from "../menu/Menu";

interface IAppealsItemProps {
    item: IAppeals
}

const AppealsItem: FC<IAppealsItemProps> = ({ item }) => {
    return (
        <div className={styles.appealsItem}>
            <div className={styles.appealsContainer}>
                <div className={styles.itemIcon}>
                    {item.status === Status.success && <div className={styles.itemSuccessIcon} />}
                    {item.status === Status.inProcess && <div className={styles.itemInProcessIcon} />}
                    {item.status === Status.sent && <div className={styles.itemSentIcon} />}
                </div>
                <div className={styles.itemData}>
                    <div className={styles.itemId}>{`№ ${item.id}`}</div>
                    <div className={styles.itemDate}>{item.date}</div>
                </div>
                <div className={styles.itemDescription}>
                    <div className={styles.itemTitle}>{item.title}</div>
                    <div className={styles.itemShortDescription}>{item.shortDescription}</div>
                </div>
                <div className={styles.itemStatus}>
                    {item.status === Status.success && <div className={styles.itemSuccessStatus}>{item.status}</div>}
                    {item.status === Status.inProcess && <div className={styles.itemInProcessStatus}>{item.status}</div>}
                    {item.status === Status.sent && <div className={styles.itemSentStatus}>{item.status}</div>}
                </div>
            </div>
        </div>
    )
}

export default AppealsItem;