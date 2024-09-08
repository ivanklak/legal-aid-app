import React, {memo, useContext} from "react";
import MainWrapper from "../components/mainWrapper/MainWrapper";
import styles from "./NewRequest.module.css";
import AuthContext from "../App/Layers/AuthProvider";
import NoAuthorized from "../components/noAuthorized/NoAuthorized";
import NewRequestDataLayerProvider from "./NewRequestDataLayer";
import DraftCreator from "./DraftCreator";
import NewRequestForm from "./newRequestForm/NewRequestForm";

const REDIRECTED_SEARCH_PARAM = 'external';

interface NewRequestsProps {}

const NewRequests = memo<NewRequestsProps>(() => {
    const { isAuth } = useContext(AuthContext);

    // проверка параметров улра
    const hasExternalSearchParams = (): boolean => {
        const searchString = new URLSearchParams(window.location.search);
        return searchString.has(REDIRECTED_SEARCH_PARAM) && searchString.get(REDIRECTED_SEARCH_PARAM) === '1'
    }

    const renderContent = (children: React.ReactNode) => {
        return hasExternalSearchParams()
            ? <div className={styles.request_container}>{children}</div>
            : (
                <MainWrapper>
                    <div className={styles.new_request}>
                        {children}
                    </div>
                </MainWrapper>
            )
    }

    return renderContent(
        <NewRequestDataLayerProvider>
            <DraftCreator>
                <div className={styles.scroll_area}>
                    <div className={styles.main_section}>
                        <div className={styles.main_caption}>Новое обращение</div>
                        {hasExternalSearchParams()
                            ? <NewRequestForm />
                            : isAuth
                                ? <NewRequestForm />
                                : <NoAuthorized />
                        }
                    </div>
                </div>
            </DraftCreator>
        </NewRequestDataLayerProvider>
    );
})

export default NewRequests;