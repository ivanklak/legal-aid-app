import React, {memo, useCallback, useState} from "react";
import styles from "./NavbarAccount.module.sass";
import { IoSettingsOutline } from "react-icons/io5";
import { BsChevronDown } from "react-icons/bs";
import {Link, useLocation, useNavigate} from "react-router-dom";
import classNames from "classnames";
import {Dropdown, MenuProps} from "antd";
import {useAuth} from "../../../app/hooks/useAuth";
import { IoLogOutOutline } from "react-icons/io5";
import { IoAccessibilityOutline } from "react-icons/io5";
import { BsBoxes } from "react-icons/bs";
import Button from "../../../designSystem/button/Button";


enum AccountMenuItems {
    account= 'account',
    logout = 'logout'
}

interface NavbarAccountProps {
    onClick: () => void;
}

const NavbarAccount = memo<NavbarAccountProps>(({onClick: propsOnClick}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const {userData, setIsAuth, setUserData} = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

    const items: MenuProps['items'] = [
        {
            icon: <IoAccessibilityOutline size={16} />,
            label: 'Аккаунт',
            key: AccountMenuItems.account,
        },
        {
            icon: <BsBoxes size={16} />,
            label: 'Что-то улетное',
            key: '1',
        },
        {
            type: 'divider',
        },
        {
            icon: <IoLogOutOutline size={16} />,
            label: 'Выйти',
            key: AccountMenuItems.logout,
        },
    ];

    const handleClick: MenuProps['onClick'] = ({ key }) => {
        switch (key) {
            case AccountMenuItems.logout: {
                // --> logout
                localStorage.removeItem('last_id');
                setIsAuth(false);
                setUserData(null);
                navigate('/');
                propsOnClick();
                return;
            }
            case AccountMenuItems.account: {
                navigate('/account');
                propsOnClick();
                return;
            }
        }
    };

    const handleOpenChange = useCallback((value: boolean) => {
        setIsDropdownOpen(value)
    }, [])

    const handleSignIn = useCallback(() => {
        navigate('/login');
        propsOnClick();
    }, [navigate, propsOnClick])

    const handleRegister = useCallback(() => {
        navigate('/registration');
        propsOnClick();
    }, [navigate, propsOnClick])

    return (
        <div className={styles['navbar-account']}>
            {!userData ? (
                <>
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
                </>
            ) : (
                <>
                    <Dropdown onOpenChange={handleOpenChange} menu={{ items, onClick: handleClick }} trigger={['click']}>
                        <div className={classNames(styles['account-name'], isDropdownOpen && styles['_active'])}>
                            <div>{`${userData.firstName} ${userData.lastLame}`}</div>
                            <BsChevronDown size={10} />
                        </div>
                    </Dropdown>
                    <Link
                        to={'/account/settings'}
                        className={classNames(
                            styles['account-settings'],
                            location.pathname === '/account/settings' && styles['_active']
                        )}
                        onClick={propsOnClick}
                    >
                        <IoSettingsOutline size={16} />
                    </Link>
                </>
            )}
        </div>
    )
})

export default NavbarAccount