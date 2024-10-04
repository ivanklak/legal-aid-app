import React, {memo} from "react";
import MainWrapper from "../../../components/mainWrapper/MainWrapper";
import NewRequestDataLayerProvider from "../../../newRequest/NewRequestDataLayer";
import DraftCreator from "../../../newRequest/DraftCreator";
import NewRequestForm from "../../../newRequest/newRequestForm/NewRequestForm";
import styles from "./MySpaceNewRequest.module.sass";

interface NewRequestProps {}

const MySpaceNewRequestPage = memo<NewRequestProps>(() => {

    const renderContent = (children: React.ReactNode) => {
        return (
            <MainWrapper>
                <div className={styles['new-request']}>
                    {children}
                </div>
            </MainWrapper>
        )
    }

    return renderContent(
        <NewRequestDataLayerProvider>
            <DraftCreator>
                <div className={styles['scroll-area']}>
                    <div className={styles['main-section']}>
                        <div className={styles['main-caption']}>Новое обращение</div>
                        <NewRequestForm />
                    </div>
                </div>
            </DraftCreator>
        </NewRequestDataLayerProvider>
    );
})

export default MySpaceNewRequestPage;