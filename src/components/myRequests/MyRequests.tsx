import React, {useEffect, useState} from "react";
import MainWrapper from "../mainWrapper/MainWrapper";
import styles from "./MyRequests.module.sass";
import {LoaderCircle} from "../loader/Loader.Circle";
import {UploadFile} from "antd";
import {ISuggestions} from "../../newRequest/api/requests/GetOrganisationSuggestionsRequest";

interface DraftData {
    name?: string;
    text?: string;
    files?: UploadFile[];
    orgData?: ISuggestions;
    orgName?: string;
    orgInn?: string;
    orgAddress?: string;
}

const DRAFT_ITEMS = ['name', 'text', 'files', 'orgData', 'orgName', 'orgInn', 'orgAddress'];

const MyRequests = () => {
    const [isReady, setIsReady] = useState<boolean>(false);
    const [draft, setDraft] = useState<DraftData>(null);

    useEffect(() => {
        const draftObj: Record<string, any> = {} as DraftData;
        DRAFT_ITEMS.forEach((item => {
            const draftItem = getDraftData(item);
            if (!!draftItem) {
                draftObj[item] = draftItem;
            }
        }))
        setDraft(draftObj);
        //
        setIsReady(true);
    }, [])

    const getDraftData = (name: string) => {
        const item = localStorage.getItem(`claim.draft.${name}`);
        if (!item) return null;
        try {
            return JSON.parse(item);
        } catch {
            return null;
        }
    }

    const renderDraftItem = () => {

        if (!draft || !draft.name || !draft.text || !draft.orgData) return null

        return (
            <div className={styles['draft']}>
                <span className={styles['caption']}>Черновик</span>
                {draft.name && <div>Название: {draft.name}</div>}
                {draft.orgData && <div>Организация: {draft.orgData.value}</div>}
                {draft.text && (
                    <div>
                        <span>Описание:</span>
                        <div className={styles['text']} dangerouslySetInnerHTML={{__html: draft.text}} />
                    </div>
                )}
            </div>
        )
    }

    return !isReady ? <LoaderCircle /> : (
        <MainWrapper>
            <div className={styles['my-requests']}>
                <div className={styles['scroll-area']}>
                    <div className={styles['title']}>Мои обращения</div>
                    <div className={styles['drafts-container']}>
                        {renderDraftItem()}
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
}

export default MyRequests;