import React, {FC, useEffect, useState} from "react";
import Header from "./header/Header";
import {Route, Routes} from "react-router-dom";
import MainPage from "../mainPageSections/mainPage/MainPage";
import MyRequests from "./myRequests/MyRequests";
import NewRequests from "../newRequest/NewRequest";
import Notifications from "../notifications/Notifications";
import Categories from "../categories/Categories";
import RequestItem from "../requestItem/RequestItem";
import HomePage from "../pages/HomePage/HomePage";
import {useAuth} from "./hooks/useAuth";
import ProtectedRoute, {ProtectedRouteProps} from "./ProtectedRoute";
import {LoaderCircle} from "./loader/Loader.Circle";
import {useLocation} from "react-router";

const Home: FC = () => {
    const {isAuth, isAuthInProgress} = useAuth();
    const currentLocation = useLocation();
    // TODO save in context https://github.com/openscript/react-router-private-protected-routes/blob/react-router-6/src/contexts/SessionContext.tsx
    const [lastPathToRedirect, setLastPathToRedirect] = useState('');
    // const [sessionContext, updateSessionContext] = useSessionContext();

    useEffect(() => {
        if (!lastPathToRedirect) setLastPathToRedirect('/dashboard')
    }, [lastPathToRedirect])

    const setRedirectPath = (path: string) => {
        setLastPathToRedirect(path);
        // updateSessionContext({...sessionContext, redirectPath: path});
    }

    const defaultProtectedRouteProps: Omit<ProtectedRouteProps, 'outlet'> = {
        isAuthenticated: isAuth,
        authenticationPath: '/login',
        redirectPath: currentLocation.pathname,
        setRedirectPath: setRedirectPath
    };

    return isAuthInProgress ? <LoaderCircle /> : (
        <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='dashboard' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<MainPage/>} />} />
            <Route path='category' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Categories/>} />} />
            <Route path='myRequests' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<MyRequests/>} />} />
            <Route path='myRequests/:id' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<RequestItem/>} />} />
            <Route path='newRequest' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<NewRequests/>} />} />
            <Route path='notifications' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Notifications/>} />} />
        </Routes>
    )
}

export default Home;