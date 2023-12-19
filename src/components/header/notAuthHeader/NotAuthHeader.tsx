import React, {memo, useCallback} from "react";
import styles from "./NotAuthHeader.module.sass";
import Button from "../../../controls/button/Button";
import {Link, useNavigate} from "react-router-dom";
import { BsBoxes } from "react-icons/bs";

interface NotAuthHeaderProps {}

const NotAuthHeader = memo<NotAuthHeaderProps>(() => {

    const navigate = useNavigate();

    const handleSignIn = useCallback(() => {
        navigate('/login')
    }, [])

    const handleRegister = useCallback(() => {
        navigate('/registration')
    }, [])

    return (
        <div className={styles['header-no-auth']}>
            <div className={styles['header-container']}>
                <div className={styles['header-body']}>
                    <div className={styles['content']}>
                        <Link to={'/'} className={styles['logo']}>
                            <BsBoxes size={22} className={styles['company-icon']} />
                        </Link>
                        <div className={styles['auth-container']}>
                            <Button
                                className={styles['sign-in-button']}
                                onClick={handleSignIn}
                            >
                                Войти
                            </Button>
                            <Button
                                className={styles['reg-button']}
                                onClick={handleRegister}
                            >
                                Регистрация
                            </Button>
                        </div>
                    </div>
                    <div className={styles['navigation']}>
                        <Link to={'/use-cases'} className={styles['item']}>Возможности</Link>
                        <Link to={'/categories'} className={styles['item']}>Категории</Link>
                        <Link to={'/support'} className={styles['item']}>Поддержка</Link>
                        <Link to={'/contacts'} className={styles['item']}>Контакты</Link>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default NotAuthHeader;