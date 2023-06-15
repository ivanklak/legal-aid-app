import React, {memo, useCallback, useState} from "react";
import {Modal} from "antd";
import {INotifications, NotificationsTitle} from "../../../mainPageSections/mainPage/MainPage";
import styles from "./NotificationsModal.module.sass";
import classNames from "classnames";
import {useNavigate} from "react-router-dom";

interface NotificationsModalProps {
    open: boolean
    setOpenModal: (val: boolean) => void;
}

const notificationsFromServer: Array<INotifications> = [
    {id: 10001, sentTime: '2 мин назад', title: NotificationsTitle.sent, isRead: false},
    {id: 10002, sentTime: '5 мин назад', title: NotificationsTitle.success, isRead: false},
    {id: 10003, sentTime: '30 мин назад', title: NotificationsTitle.newStatus, isRead: false},
    {id: 10004, sentTime: '1 ч назад', title: NotificationsTitle.newStatus, isRead: true},
    {id: 10005, sentTime: '2 ч назад', title: NotificationsTitle.sent, isRead: true},
]

const NotificationsModal = memo<NotificationsModalProps>(({open, setOpenModal}) => {
    const navigate = useNavigate();
    const handleCloseModal = useCallback(() => {
        setOpenModal(false);
    },[setOpenModal])

    const onItemClick = useCallback(() => {
        navigate('/notifications')
    }, [navigate])

    return (
        <Modal
            title="Уведомления"
            open={open}
            onCancel={handleCloseModal}
            style={{
                position: 'fixed',
                top: '56px',
                right: '20px',
                height: 'calc(100vh - 75pt)',
                maxWidth: '580px',
            }}
            mask={false}
            maskClosable={true}
            footer={null}
            className={styles.modalStyle}
            bodyStyle={{position: "relative", height: '80%'}}
        >
            <div className={styles.content}>
                {!notificationsFromServer.length ? (
                    <div className={styles.no_notifications}>Нет уведомлений за последние 30 дней.</div>
                ) : (
                    <>
                        {notificationsFromServer.map((item) => (
                            <div className={styles.notification_item} key={item.id} onClick={onItemClick}>
                                <div className={styles.left_container}>
                                    <div className={classNames(
                                        styles.itemIcon,
                                        item.isRead && styles.readIcon
                                    )}/>
                                    <div>{item.title}</div>
                                </div>
                                <div>{item.sentTime}</div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </Modal>
    )
})

export default NotificationsModal;