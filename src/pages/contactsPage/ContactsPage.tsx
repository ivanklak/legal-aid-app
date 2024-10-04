import React from "react";
import styles from "./ContactsPage.module.sass";

const ContactsPage = () => {
    return (
        <div className={styles['page-body']}>
            <div className={styles['greetings-section']}>
                <div className={styles['content-container']}>
                    <div>тут будут контакты нашего крутого бизнес офиса</div>
                    <div>с блек джеком и шлюхами :D</div>
                </div>
            </div>
        </div>
    )
}

export default ContactsPage