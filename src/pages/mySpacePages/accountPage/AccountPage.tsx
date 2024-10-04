import React, {memo} from "react";
import styles from "./AccountPage.module.sass";
import MainWrapper from "../../../components/mainWrapper/MainWrapper";

interface AccountPageProps {}

const AccountPage = memo<AccountPageProps>(() => {
    return (
        <MainWrapper>
            <div className={styles['account-page']}>
                <h1>Аккаунт</h1>
            </div>
        </MainWrapper>
    )
})

export default AccountPage;