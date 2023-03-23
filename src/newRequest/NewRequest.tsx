import React from "react";
import MainWrapper from "../components/mainWrapper/MainWrapper";
import styles from "./NewRequest.module.css";
import NavigatedSearchBar from "../mainPageSections/search/SearchBar";
import HelpLink from "./help/HelpLink";

const NewRequests = () => {
    return (
        <MainWrapper>
            <div className={styles.new_request}>
                <div className={styles.main_section}>
                    <div className={styles.main_caption}>Создать обращение</div>
                    <div className={styles.scroll_area}>
                        <div className={styles.create_form}>
                            <p>инпут с ФИО</p>
                            <p>адрес</p>
                            <p></p>
                            <p>дропдаун с выбором учреждения</p>
                            <p>категория обращения</p>
                            <p>текстэрия - обращение</p>
                            <p>кнопка - сабмит</p>
                        </div>
                    </div>
                </div>
                <div className={styles.right_sideBar}>
                    <div className={styles.search_block}>
                        <NavigatedSearchBar />
                    </div>
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
            </div>
        </MainWrapper>
    );
}

export default NewRequests;