import React, {useEffect, useState} from "react";
import MainWrapper from "../mainWrapper/MainWrapper";
import styles from "./MyRequests.module.sass";
import {LoaderCircle} from "../loader/Loader.Circle";
import {ISuggestions} from "../../newRequest/api/requests/GetOrganisationSuggestionsRequest";
import {IFullRequestInfo} from "../../newRequest/newRequestForm/parts/newRequestFinalPart/NewRequestFinalPart";
import {formats} from "../../requestItem/textEditor/EditorToolbar";
import ReactQuill from "react-quill";
import {IOrganisationData} from "../../newRequest/NewRequestDataLayer";
import {useNavigate} from "react-router-dom";

const MyRequests = () => {
    const navigate = useNavigate();
    const [isReady, setIsReady] = useState<boolean>(false);
    const [requests, setRequests] = useState<IFullRequestInfo[]>([]);

    useEffect(() => {
        getAllClaims()
            .then((data: IFullRequestInfo[]) => {
                if (!data?.length) {
                    setIsReady(true);
                    setRequests([]);
                    return;
                }
                setRequests(data);
                setIsReady(true);
            })
            .catch((e) => {
                console.log('нет обращений', e);
                setIsReady(true);
            })
    }, [])

    const getAllClaims = (): Promise<IFullRequestInfo[]> => {
        return new Promise((resolve, reject) => {
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
                console.error('Cannot parse user_requests in MyRequests -> existedRequestsString', existedRequestsString);
            }

            if (!existedRequestsArray.length) {
                reject();
                return;
            }

            window.setTimeout(() => {
                resolve(existedRequestsArray);
            }, 1000)
        })
    }

    const renderOrg = (name: string, address: string, inn: string) => {
        return (
            <div className={styles['org-table']}>
                <div className={styles['org-row']}>
                    <div className={styles['key']}>Название</div>
                    <div className={styles['value']}>{name}</div>
                </div>
                <div className={styles['org-row']}>
                    <div className={styles['key']}>Адрес</div>
                    <div className={styles['value']}>{address}</div>
                </div>
                <div className={styles['org-row']}>
                    <div className={styles['key']}>Инн</div>
                    <div className={styles['value']}>{inn}</div>
                </div>
            </div>
        )
    }

    const handleRequestClick = (id: string) => {
        navigate(`/mySpace/myRequests/${id}`)
    }

    const isSuggestion = (info: IOrganisationData): info is ISuggestions => {
        return info && Boolean((info as ISuggestions).data) && Boolean((info as ISuggestions).value)
    }

    const renderRequests = (): JSX.Element => {
        return (
            <>
                {requests.map((requestItem: IFullRequestInfo, index) => {
                    const statusMessage = requestItem.status === 'created' ? 'Создано' : 'Создано';

                    const firstIndex = requestItem.requestText.indexOf('<p>');
                    const lastIndex = requestItem.requestText.indexOf('</p>');
                    const shortDescription = requestItem.requestText.slice(firstIndex, lastIndex + 4);

                    return (
                        <div key={`${requestItem.id}_${index}`} className={styles['request']}>
                            {requestItem.status && <div className={styles['status']}>{statusMessage}</div>}
                            <div
                                className={styles['caption']}
                                onClick={() => handleRequestClick(requestItem.id)}
                            >
                                {requestItem.reason.text}
                            </div>
                            <div className={styles['name']}>Куда</div>
                            {isSuggestion(requestItem.org)
                                ? renderOrg(requestItem.org.value, requestItem.org.data.address.value, requestItem.org.data.inn)
                                : renderOrg(requestItem.org.name, requestItem.org.address, requestItem.org.inn)
                            }
                            <div className={styles['name']}>Описание</div>
                            <ReactQuill
                                className={styles['text']}
                                theme="snow"
                                value={shortDescription || '...'}
                                formats={formats}
                                modules={{toolbar: null}}
                                readOnly={true}
                            />
                            <div className={styles['comments']}>Комментарии: {requestItem.comments?.length ? requestItem.comments.length : 0}</div>
                        </div>
                    )
                })}
            </>
        );
    }

    return !isReady ? <LoaderCircle /> : (
        <MainWrapper>
            <div className={styles['my-requests']}>
                <div className={styles['scroll-area']}>
                    <div className={styles['title']}>Мои обращения</div>
                    <div className={styles['requests-container']}>
                        {!!requests.length
                            ? renderRequests()
                            : <div>У вас пока что нет обращений</div>
                        }
                    </div>
                </div>
            </div>
        </MainWrapper>
    );
}

export default MyRequests;