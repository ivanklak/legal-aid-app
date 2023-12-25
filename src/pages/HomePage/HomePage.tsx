import React, {memo, useCallback} from "react";
import styles from "./HomePage.module.sass";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../components/hooks/useAuth";
import NotAuthHeader from "../../components/header/notAuthHeader/NotAuthHeader";
import {BsChevronRight} from "react-icons/bs";

interface HomePageProps {}

const HomePage = memo<HomePageProps>(() => {
    const {isAuth} = useAuth();
    const navigate = useNavigate();

    const onCreateClick = useCallback(() => {
        isAuth ? navigate('/newRequest') : navigate('/login')
    }, [isAuth, navigate])

    const onSignInClick = useCallback(() => {
        navigate('/registration')
    }, [navigate])

    return (
        <>
            <NotAuthHeader />
            <div className={styles['home-page']}>
                <div className={styles['greetings-section']}>
                    <div className={styles['content-container']}>
                        <div className={styles['content']}>
                            <span className={styles['caption']}>Жалуйтесь от души.</span>
                            {/*<div className={styles['text']}>Жалобы, замечания, вопросы, идеи — дайте им выход.</div>*/}
                            <div className={styles['text']}>
                                Превратите ваше недовольство в действие: <span className={styles['link']} onClick={onCreateClick}>создайте жалобу</span> в мгновение и получите решение незамедлительно.
                            </div>
                            <div className={styles['text']}>
                                <span className={styles['link']} onClick={onSignInClick}>Начать бесплатно</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles['categories-section']}>
                    <div className={styles['content-container']}>
                        <div className={styles['row']}>
                            <div className={styles['item']}>
                                <div className={styles['title-container']}>
                                    <div className={styles['item-title']}>Приватно</div>
                                    <div className={styles['item-caption']}>Напрямую в организацию.</div>
                                </div>
                                <div className={styles['item-text']}>Получайте уведомления по вашему обращению. Ведите деловую переписку с организацией.</div>
                                <Link to={'/use-cases'} className={styles['find-out-link']}>
                                    <span>Узнать больше</span>
                                    <BsChevronRight className={styles['chevron-icon']} size={10} />
                                </Link>
                            </div>
                            <div className={styles['item']}>
                                <div className={styles['title-container']}>
                                    <div className={styles['item-title']}>Публично</div>
                                    <div className={styles['item-caption']}>Чтобы все увидели.</div>
                                </div>
                                <div className={styles['item-text']}>Все пользователи смогут видеть, поддерживать или дополнять ваше обращение.</div>
                                <Link to={'/use-cases'} className={styles['find-out-link']}>
                                    <span>Узнать больше</span>
                                    <BsChevronRight className={styles['chevron-icon']} size={10} />
                                </Link>
                            </div>
                            <div className={styles['item']}>
                                <div className={styles['title-container']}>
                                    <div className={styles['item-title']}>Куда следует</div>
                                    <div className={styles['item-caption']}>Если не знаете куда.</div>
                                </div>
                                <div className={styles['item-text']}>Направьте свою жалобу в компетентные органы. Мы сами оформим все официально.</div>
                                <Link to={'/use-cases'} className={styles['find-out-link']}>
                                    <span>Узнать больше</span>
                                    <BsChevronRight className={styles['chevron-icon']} size={10} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
})

export default HomePage;