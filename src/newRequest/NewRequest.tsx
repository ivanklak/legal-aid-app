import React, {useContext} from "react";
import MainWrapper from "../components/mainWrapper/MainWrapper";
import styles from "./NewRequest.module.css";
import AuthContext from "../App/Layers/AuthProvider";
import NoAuthorized from "../components/noAuthorized/NoAuthorized";
import NewRequestDataLayerProvider from "./NewRequestDataLayer";
import CreateNewClaimForm from "./createForm/CreateNewClaimForm";
import DraftCreator from "./DraftCreator";

const NewRequests = () => {
    const { isAuth } = useContext(AuthContext);

    return (
        <MainWrapper>
            <div className={styles.new_request}>
                <NewRequestDataLayerProvider>
                    <DraftCreator>
                        <div className={styles.scroll_area}>
                            <div className={styles.main_section}>
                                <div className={styles.main_caption}>Новое обращение</div>
                                {isAuth
                                    ? <CreateNewClaimForm />
                                    : <NoAuthorized />
                                }
                            </div>
                        </div>
                    </DraftCreator>
                </NewRequestDataLayerProvider>
                {/*<div className={styles.right_sideBar}>*/}
                {/*    <div className={styles.caption}>*/}
                {/*        Помощь*/}
                {/*    </div>*/}
                {/*    <div className={styles.popular_questions}>*/}
                {/*        <HelpLink*/}
                {/*            text="Как заполнять бланк обращения"*/}
                {/*            description={'Перейдите в раздел Новое Обращение и заполните данные о себе. Далле подробно укажите причину и опишите вашу проблему. После заполнения всех полей нажмите на кнопку "Отправить" и ваше обращение поступит к нам.'}*/}
                {/*        />*/}
                {/*        <HelpLink*/}
                {/*            text="Куда обратиться"*/}
                {/*            description={'Перейдите в раздел Категории и выберете учреждение, в которое вы хотите обратиться. Или можете спросить у нашего сотрудника.'}*/}
                {/*        />*/}
                {/*        <HelpLink*/}
                {/*            text="Как быстро обрабатываются жалобы"*/}
                {/*            description={'Скорость обработки обращений зависит от множества факторов. Подробную информацию о статусе вашего обращения можно узнать в разделе Мои Обращения'}*/}
                {/*        />*/}
                {/*        <HelpLink*/}
                {/*            className={styles.last_link}*/}
                {/*            text="Процесс подачи и обработки жалобы"*/}
                {/*            description={'1.После отправки вашего обращения оно поступает к нам. ' +*/}
                {/*                '2.Далее формируются необходимые документы и ... ' +*/}
                {/*                '3. Документы отправляются по месту требования.' +*/}
                {/*                '4. Происходит магия и вы получаете уведомление с решением вашей жалобы'*/}
                {/*            }*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </MainWrapper>
    );
}

export default NewRequests;