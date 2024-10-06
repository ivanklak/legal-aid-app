import React, {FC} from 'react';
import styles from "./AppealsItem.module.css";
import {StatusV2} from "../../pages/mySpacePages/dashboardPage/DashboardPage";
import {HiOutlineBuildingLibrary} from "react-icons/hi2";
import {ClaimsItemResponse} from "../api/requests/GetClaimsRequest";
import {getDateFromString} from "../../handlers/getDateFromString";

interface IAppealsItemProps {
    item: ClaimsItemResponse
}

const AppealsItem: FC<IAppealsItemProps> = ({ item }) => {
    return (
        <div className={styles.appealsItem}>
            <div className={styles.appealsContainer}>
                <div className={styles.itemData}>
                    <div className={styles.itemId}>{`№ ${item.genId}`}</div>
                    <div className={styles.itemDate}>{getDateFromString(item.createdDate)}</div>
                </div>
                <div className={styles.itemIcon}>
                    <div className={styles.iconContainer}>
                        <HiOutlineBuildingLibrary size={20} />
                    </div>
                </div>
                <div className={styles.itemDescription}>
                    <div className={styles.itemTitle}>{item.name}</div>
                    <div className={styles.itemShortDescription}>{item.text}</div>
                </div>
                <div className={styles.itemStatus}>
                    {item.status === StatusV2.resolved && <div className={styles.itemSuccessStatus}>{item.status}</div>}
                    {item.status === StatusV2.inProcess && <div className={styles.itemInProcessStatus}>{item.status}</div>}
                    {item.status === StatusV2.new && <div className={styles.itemSentStatus}>{item.status}</div>}
                    {item.status === StatusV2.decline && <div className={styles.itemVerificationStatus}>{item.status}</div>}
                    {item.status === StatusV2.waitingForAction && <div className={styles.itemWaitingForAction}>{item.status}</div>}
                </div>
            </div>
        </div>
    )
}

export default AppealsItem;