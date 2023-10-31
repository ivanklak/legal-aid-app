import React, {useCallback, useContext, useState} from "react";
import MainWrapper from "../components/mainWrapper/MainWrapper";
import styles from "./NewRequest.module.css";
import HelpLink from "./help/HelpLink";
import ClientNameData from "./clientNameData/ClientNameData";
import ClientProblemData from "./clientProblemData/ClientProblemData";
import CenterContent from "../components/centerContent/CenterContent";
import AuthContext from "../App/Layers/AuthProvider";
import NoAuthorized from "../components/noAuthorized/NoAuthorized";
import NewRequestDataLayerProvider from "./NewRequestDataLayer";
import SubmitForm from "./submitForm/SubmitForm";

const NewRequests = () => {
    const { isAuth } = useContext(AuthContext);
    const [isNameFormSubmitted, setIsNameFormSubmitted] = useState<boolean>(false);
    const [isProblemFormSubmitted, setIsProblemFormSubmitted] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    const onSubmitClientNameForm = useCallback((success: boolean) => {
        setIsNameFormSubmitted(success);
    }, [])

    const onSubmitProblemForm = useCallback((success: boolean) => {
        setIsProblemFormSubmitted(success);
    }, [])

    // const submitFullForm = useCallback(() => {
    //     if (isProblemFormSubmitted) {
    //         // afterSubmit();
    //         setError(null);
    //     } else {
    //         setError('Пожалуйста заполните все поля и повторите попытку')
    //     }
    // }, [isProblemFormSubmitted])

    return (
        <MainWrapper>
            <CenterContent className={styles.new_request}>
                <NewRequestDataLayerProvider>
                    <div className={styles.scroll_area}>
                        <div className={styles.main_section}>
                            <div className={styles.main_caption}>Создать обращение</div>
                            {isAuth ? (
                                <div className={styles.create_form}>
                                    <ClientNameData onSubmitForm={onSubmitClientNameForm}/>
                                    <ClientProblemData
                                        disabled={false}
                                        onSubmitForm={onSubmitProblemForm}
                                    />
                                    {isProblemFormSubmitted && (
                                        <SubmitForm error={error} />
                                    )}
                                </div>
                            ) : (
                                <NoAuthorized />
                            )}
                        </div>
                    </div>
                </NewRequestDataLayerProvider>
                <div className={styles.right_sideBar}>
                    <div className={styles.caption}>
                        Помощь
                    </div>
                    <div className={styles.popular_questions}>
                        <HelpLink
                            text="Как заполнять бланк обращения"
                            description={'Перейдите в раздел Новое Обращение и заполните данные о себе. Далле подробно укажите причину и опишите вашу проблему. После заполнения всех полей нажмите на кнопку "Отправить" и ваше обращение поступит к нам.'}
                        />
                        <HelpLink
                            text="Куда обратиться"
                            description={'Перейдите в раздел Категории и выберете учреждение, в которое вы хотите обратиться. Или можете спросить у нашего сотрудника.'}
                        />
                        <HelpLink
                            text="Как быстро обрабатываются жалобы"
                            description={'Скорость обработки обращений зависит от множества факторов. Подробную информацию о статусе вашего обращения можно узнать в разделе Мои Обращения'}
                        />
                        <HelpLink
                            className={styles.last_link}
                            text="Процесс подачи и обработки жалобы"
                            description={'1.После отправки вашего обращения оно поступает к нам. ' +
                                '2.Далее формируются необходимые документы и ... ' +
                                '3. Документы отправляются по месту требования.' +
                                '4. Происходит магия и вы получаете уведомление с решением вашей жалобы'
                            }
                        />
                    </div>
                </div>
            </CenterContent>
        </MainWrapper>
    );
}

export default NewRequests;