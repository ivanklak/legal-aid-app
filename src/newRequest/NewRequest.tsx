import React, {memo, useContext} from "react";
import MainWrapper from "../components/mainWrapper/MainWrapper";
import styles from "./NewRequest.module.css";
import AuthContext from "../App/Layers/AuthProvider";
import NoAuthorized from "../components/noAuthorized/NoAuthorized";
import NewRequestDataLayerProvider from "./NewRequestDataLayer";
import DraftCreator from "./DraftCreator";
import NewRequestForm from "./newRequestForm/NewRequestForm";
import Header from "../components/header/Header";
import ContentBody from "../components/contentBody/ContentBody";
import Navbar from "../components/navbar/Navbar";
import {useLocation} from "react-router-dom";

const REDIRECTED_SEARCH_PARAM = 'external';

interface NewRequestsProps {}

const NewRequests = memo<NewRequestsProps>(() => {
    const { isAuth } = useContext(AuthContext);
    const location = useLocation();

    console.log('location', location)

    // проверка параметров улра
    const hasExternalSearchParams = (): boolean => {
        const searchString = new URLSearchParams(location.search);
        return searchString.has(REDIRECTED_SEARCH_PARAM) && searchString.get(REDIRECTED_SEARCH_PARAM) === '1'
    }

    const renderContent = (children: React.ReactNode) => {
        return hasExternalSearchParams()
            ? <div className={styles.request_container}>{children}</div>
            : (
                <>
                    <Header/>
                    <ContentBody>
                        <Navbar/>
                        <MainWrapper>
                            <div className={styles.new_request}>
                                {children}
                            </div>
                        </MainWrapper>
                    </ContentBody>
                </>
            )
    }

    return renderContent(
        <NewRequestDataLayerProvider>
            <DraftCreator>
                <div className={styles.scroll_area}>
                    <div className={styles.main_section}>
                        <div className={styles.main_caption}>Новое обращение</div>
                        {hasExternalSearchParams() || isAuth
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