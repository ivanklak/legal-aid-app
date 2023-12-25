import React from "react";
import {useState, useEffect, useRef} from "react";
import {useNavigate, useLocation, Link} from "react-router-dom";
import {useAuth} from "../components/hooks/useAuth";
import login_styles from './login.module.css';
import {FiMail} from 'react-icons/fi';
import {FiLock} from 'react-icons/fi';
import {FiEye} from 'react-icons/fi';
import {FiEyeOff} from 'react-icons/fi';
import {requestLogin} from "./api/methods/requestLogin";
import {LoginResponse} from "./api/requests/PostLoginRequest";
import classNames from "classnames";

const Login = () => {
    const {
        isAuth,
        isAuthInProgress,
        setAuthData,
        setIsAuthInProgress,
        requestGetInfo
    } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    // @ts-ignore
    const from = location.state?.from?.pathname || "/";
    const errRefLogin = useRef();

    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsgLogin, setErrMsgLogin] = useState('');

    useEffect(() => {
        if (isAuth) setTimeout(() => navigate('/'), 500);
        //TODO предусмотреть лоадер
    }, [isAuth, navigate, isAuthInProgress])

    useEffect(() => {
        setErrMsgLogin('');
    }, [email, pwd]);

    const [isPwShow, setActive] = useState(false);
    const clickEye = () => {
        setActive(!isPwShow);
    }

    const handleLoginSubmit = async (e: any) => {
        e.preventDefault();
        setIsAuthInProgress(true);
        try {
            const response: LoginResponse = await requestLogin(email, pwd);
            if (response) {
                applyLoginResponse(response);
            }
        } catch (err) {
            console.log('handleLoginSubmit error', {err});
            if (!err.response) {
                setErrMsgLogin('Нет ответа от сервера');
            } else if (err.response?.status === 403) {
                setErrMsgLogin('Неверный логин пользователя или пароль');
            } else {
                setErrMsgLogin('Login Failed');
            }
            setIsAuthInProgress(false);
        }
    }

    const applyLoginResponse = (response: LoginResponse) => {
        if (!!response.errorCode) {
            setErrMsgLogin(response.message);
            setIsAuthInProgress(false);
            return;
        }
        // save in context
        setAuthData(response);
        navigate('/dashboard', {replace: true});
        // save in storage
        localStorage.setItem("token", response.access_token);
        localStorage.setItem('id', response.sessionId);
        localStorage.setItem('email', email);
        requestGetInfo();
    }

    return (
        <header className={login_styles.header}>
            <div className={login_styles.container}>
                <div className={login_styles.forms}>
                    {/*login */}
                    <div className={classNames(login_styles.form, login_styles.login)}>
                        <span className={login_styles.title}>Login</span>
                        <form className="loginForm" onSubmit={handleLoginSubmit}>
                            <div className={login_styles.input_field}>
                                <input className="login__email"
                                       type="email"
                                       placeholder="Enter your email"
                                       onChange={(e) => setEmail(e.target.value)}
                                       required/>
                                <i className={login_styles.icon}><FiMail/></i>
                            </div>
                            <div className={login_styles.input_field}>
                                <input
                                    type={!isPwShow ? "password" : "text"}
                                    className="login__password password"
                                    placeholder="Enter password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    required
                                />
                                <i className={login_styles.icon}><FiLock/></i>
                                <i className={login_styles.showHidePw} onClick={clickEye}>
                                    {!isPwShow ? <FiEye/> : <FiEyeOff/>}
                                </i>
                            </div>
                            <div className={login_styles.checkbox_text}>
                                <div className={login_styles.checkbox_content}>
                                    <input type="checkbox" id="logCheck"/>
                                    <label htmlFor="logCheck" className={login_styles.text}>Remember me</label>
                                </div>
                                <a href="src/login/Login#" className={login_styles.text}>Forgot password?</a>
                            </div>
                            <div className={classNames(login_styles.input_field, login_styles.button)}>
                                <input type="submit" value="Login Now" className="loginButton"/>
                                <small
                                    ref={errRefLogin}
                                    className={classNames(
                                        errMsgLogin ? login_styles.errmsg : login_styles.offscreen
                                    )}
                                >
                                    {errMsgLogin}
                                </small>
                            </div>
                        </form>

                        <div className={login_styles.login_signup}>
                            <span className={login_styles.text}>Not a member?&nbsp;
                                <Link to={'/registration'} className={login_styles.text}>Регистрация</Link>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Login;