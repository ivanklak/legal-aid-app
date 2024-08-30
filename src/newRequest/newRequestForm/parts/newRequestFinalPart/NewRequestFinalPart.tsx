import React, {memo, useState} from "react";
import styles from "./NewRequestFinalPart.module.sass";
import Button from "../../../../controls/button/Button";
import {IOrganisationData, useSafeNewRequestDataLayerContext} from "../../../NewRequestDataLayer";
import {useAuth} from "../../../../components/hooks/useAuth";
import {ISuggestions} from "../../../api/requests/GetOrganisationSuggestionsRequest";
import OrganisationForm from "../../components/organisationForm/OrganisationForm";
import classNames from "classnames";
import TextEditor from "../../../../requestItem/textEditor/TextEditor";
import {Modal} from "antd";
import {LoaderCircle} from "../../../../components/loader/Loader.Circle";
import {useNavigate} from "react-router-dom";

interface NewRequestFinalPartProps {
    onPrevPageClick: () => void;
}

const CAPTION = 'Ваше обращение';

const NewRequestFinalPart = memo<NewRequestFinalPartProps>(({onPrevPageClick}) => {
    const {reason, organisationData, claimText, files} = useSafeNewRequestDataLayerContext();
    const {userData} = useAuth();
    const navigate = useNavigate();

    const [successDialogOpened, setSuccessDialogOpened] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const isSuggestion = (info: IOrganisationData): info is ISuggestions => {
        return info && Boolean((info as ISuggestions).data) && Boolean((info as ISuggestions).value)
    }

    const renderOrganisation = () => {

        if (isSuggestion(organisationData)) {
            return (
                <OrganisationForm data={organisationData} />
            )
        }

        return (
            <div>
                <div>{organisationData.name}</div>
                <div>{organisationData.inn}</div>
                <div>{organisationData.address}</div>
            </div>
        )
    }

    const handleSendClaimRequest = () => {
        sendClaim()
            .then((value) => {
                if (value) {
                    setSuccessDialogOpened(value);
                    setError('');
                } else {
                    setError('Что-то пошло не так :(')
                }
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                setError('Введены не все данные :(')
                console.log('handleSendClaimRequest -> error', error)
            })
    }

    const sendClaim = (): Promise<boolean> => {
        setIsLoading(true);
        return new Promise((resolve, reject) => {
            if (!reason || !organisationData || !claimText || !userData) {
                reject();
                return;
            }

            window.setTimeout(() => {
                resolve(true);
            }, 1500)
        })
    }

    const handleModalOk = () => {
        setSuccessDialogOpened(false);
        navigate('/myRequests');
    }

    return (
        <div className={styles['final']}>
            <h2 className={styles['caption']}>{CAPTION}</h2>
            <div className={styles['final-content']}>
                <div className={styles['content-block']}>
                    <div className={styles['block-caption']}>Причина</div>
                    <div className={styles['block-description']}>{reason.text}</div>
                </div>
                <div className={styles['content-block']}>
                    <div className={styles['block-caption']}>Организация</div>
                    <div className={styles['block-description']}>{renderOrganisation()}</div>
                </div>
                <div className={styles['content-block']}>
                    <div className={styles['block-caption']}>Обращение</div>
                    <div className={styles['block-description']}>
                        <TextEditor
                            value={claimText}
                            files={files}
                            onChange={() => {}}
                            placeHolder='Используйте меню выше чтобы форматировать описание'
                            showButtons={false}
                            toolBarClassName={styles['editor-tool-bar']}
                            editTextClassName={classNames(
                                styles['editor-edit-text']
                            )}
                        />
                    </div>
                </div>
                <div className={styles['content-block']}>
                    <div className={styles['block-caption']}>Контакты</div>
                    <div className={styles['block-description']}>
                        <div className={styles['login-user-data']}>
                            <div className={styles['name']}>{userData.firstName} {userData.lastLame}</div>
                            <div className={styles['data-item']}>Email: {userData.email}</div>
                            <div className={styles['data-item']}>Адресс: {userData.address}</div>
                            <div className={styles['data-item']}>ИНН: {userData.inn}</div>
                        </div>
                    </div>
                </div>
            </div>
            {error && <div>{error}</div>}
            <div className={styles['buttons']}>
                <Button onClick={onPrevPageClick} className={styles['back-btn']}>Назад</Button>
                <Button onClick={handleSendClaimRequest} className={styles['send-btn']}>Отправить</Button>
            </div>
            <Modal
                title={'Обращение отправлено'}
                open={successDialogOpened}
                onOk={handleModalOk}
                onCancel={handleModalOk}
                okText="Мои обращения"
                cancelText="Закрыть"
            >
                <div>{'Вы успешно создали обращение. Наши специалисты рассмотрят его в ближайшее время. Следить за статусом обращения можно в разделе "Мои обращения".' }</div>
            </Modal>
            {isLoading && <LoaderCircle />}
        </div>
    )
})

export default NewRequestFinalPart;