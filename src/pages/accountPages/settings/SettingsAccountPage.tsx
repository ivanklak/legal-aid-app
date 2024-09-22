import React, {memo} from "react";
import styles from "./SettingsAccountPage.module.sass";
import MainWrapper from "../../../components/mainWrapper/MainWrapper";

interface AccountPageProps {}

const SettingsAccountPage = memo<AccountPageProps>(() => {
    return (
        <MainWrapper>
            <div className={styles['settings-account-page']}>
                <h1>Настройки аккаунта</h1>
            </div>
        </MainWrapper>
    )
})

export default SettingsAccountPage;