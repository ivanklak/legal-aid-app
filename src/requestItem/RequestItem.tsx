import React, {useCallback, useEffect, useState} from "react";
import {useParams} from "react-router";
import MainWrapper from "../components/mainWrapper/MainWrapper";
import styles from "./RequestItem.module.sass";
import ClaimActions from "./claimActions/ClaimActions";
import AdditionalInfo from "./additionalInfo/AdditionalInfo";
import getClaimsRequest from "../mainPageSections/api/metods/getClaimsRequest";
import {ClaimsItemResponse, IComment} from "../mainPageSections/api/requests/GetClaimsRequest";
import TextEditor from "./textEditor/TextEditor";
import {sendComment} from "../service/network/requestItem/methods/sendComment";
import DraftCreator from "../newRequest/DraftCreator";
import {IFullRequestInfo} from "../newRequest/newRequestForm/parts/newRequestFinalPart/NewRequestFinalPart";
import {LoaderCircle} from "../components/loader/Loader.Circle";
import classNames from "classnames";
import {formats} from "./textEditor/EditorToolbar";
import ReactQuill from "react-quill";

const CAPTION = 'Читос или кузя лакомкин?';
const ITEM_DESCRIPTION = 'Многие меня спрашивают читос или кузя лакомкин. Скажу по секрету, что между ними стоит еще один титан. Это русская картошка. ' +
    'Базарю. Под пивас вообще четко залетает, тает во рту, каеф. Будто девчонку первый раз попробовал. И к слову жизнь как рюкзак нагруженный пивом - чем больше пьешь пиво тем тебе легче. Главное перед мамой не спалиться'

const RequestItem = () => {
    const {id} = useParams();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [data, setData] = useState<ClaimsItemResponse>(null);
    const sessionId = localStorage.getItem('id');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        console.log('id', id)
        // requestClaims();

        testRequestClaim(id)
            .then((data) => {
                if (!data) {
                    setData(null);
                    setError('Жалобы не существует');
                } else {
                    setData({
                        contentType: '',
                        createdDate: '2023-06-12 16:52', // "2023-06-12 16:52:48.343"
                        genId: data.id, //"1e3ec6b0-0d2e-4671-89a1-a637ae4b7986"
                        name: data.reason.text, //"Жалоба на врача"
                        status: data.status, //"RESOLVED"
                        text: data.requestText, //"Колоноскопия прошла не успешно - я обосрался"
                        comments: []
                    })
                }
                setIsLoading(false);
            })
            .catch(() => {
                console.error('Невозможно получить данные по id')
                setError('Невозможно получить данные по id');
                setIsLoading(false);
            })
    }, [id])

    const requestClaims = useCallback(async () => {

        if (!sessionId) return;
        try {
            const response = await getClaimsRequest(sessionId);
            if (response) {
                console.log('res', response);
                const requiredData = response.claims.find((claim) => claim.genId === id);
                setData(requiredData);
                setIsLoading(false);
            }
        } catch (err) {
            console.log('requestClaims err', err)
            setIsLoading(false);
        }
    }, [id, sessionId])

    const testRequestClaim = (reqId: string): Promise<IFullRequestInfo> => {
        setIsLoading(true);

        return new Promise((resolve, reject) => {
            if (!reqId) {
                reject();
                return;
            }

            const existedRequestsString = localStorage.getItem('user_requests');

            let existedRequestsArray: IFullRequestInfo[] = [];

            try {
                if (existedRequestsString) {
                    const parsedRegUsers: IFullRequestInfo[] = JSON.parse(existedRequestsString) || [];

                    if (parsedRegUsers?.length) {
                        existedRequestsArray.push(...parsedRegUsers);
                    }
                }
            } catch (e) {
                console.error('Cannot parse user_requests in FinalPArt -> existedRequestsString', existedRequestsString);
            }

            if (!existedRequestsArray.length) {
                resolve(null)
            } else {
                const requestInfo: IFullRequestInfo = existedRequestsArray.find((data) => data.id === reqId);

                if (!requestInfo) {
                    resolve(null);
                } else {
                    window.setTimeout(() => resolve(requestInfo), 300)
                }
            }
        })
    }

    const handleSaveComment = useCallback(async (text: string) => {
        const params = { claimId: id, sessionId: sessionId, text: text };
        try {
            const sendCommentResponse = await sendComment(params);

            console.log('sendCommentResponse', sendCommentResponse);
            setIsLoading(false);
        } catch (err) {
            console.log('handleSaveComment err', err)
            console.log('handleSaveComment err', {err})
            setIsLoading(false);
        }
    }, [id, sessionId])

    if (error) return <div>{error}</div>
    if (!data) return null;

    return isLoading && !data ? <LoaderCircle /> : (
        <MainWrapper>
            <DraftCreator>
                <div className={styles.main_info}>
                    <div className={styles.form}>
                        <div className={styles.caption}>{data.name}</div>
                        <div className={styles.description}>Описание</div>
                        <ReactQuill
                            className={classNames(
                                styles.description_text
                            )}
                            theme="snow"
                            onChange={() => {}}
                            value={data.text || ''}
                            formats={formats}
                            modules={{toolbar: null}}
                            readOnly={true}
                        />
                        <div className={styles.attachments}>Вложения</div>
                        <div className={styles.attachment_items}>
                            <div className={styles.attach_item}>
                                .doc
                            </div>
                            <div className={styles.attach_item}>
                                .pdf
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <div className={styles.title}>Активность</div>
                        <TextEditor saveComment={handleSaveComment} />
                        {data.comments.length ? (
                            <ClaimActions actions={data.comments} id={id}/>
                        ) : (
                            <div className={styles.no_activities}>Нет активности</div>
                        )}
                    </div>
                </div>
                <AdditionalInfo />
            </DraftCreator>
        </MainWrapper>
    )
}
export default RequestItem;