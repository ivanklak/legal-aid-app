import React, {FC, useEffect, useState} from "react";
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
import UseCasesPage from "../pages/UseCasesPage/UseCasesPage";
import CategoriesPage from "../pages/CategoriesPage/CategoriesPage";
import ContactsPage from "../pages/ContactsPage/ContactsPage";
import SupportPage from "../pages/SupportPage/SupportPage";
import MySpacePage from "../pages/MySpacePages/MySpacePage/MySpacePage";
import MySpaceNewRequestPage from "../pages/MySpacePages/NewRequestPage/MySpaceNewRequestPage";
import AccountPage from "../pages/MySpacePages/AccountPage/AccountPage";
import SettingsAccountPage from "../pages/accountPages/settings/SettingsAccountPage";

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
            <Route path='use-cases' element={<UseCasesPage />} />
            <Route path='categories' element={<CategoriesPage />} />
            <Route path='support' element={<SupportPage />} />
            <Route path='contacts' element={<ContactsPage />} />
            <Route path='/mySpace' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<MySpacePage/>} />} />
            <Route path='/mySpace/dashboard' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<MainPage/>} />} />
            <Route path='/mySpace/category' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Categories/>} />} />
            <Route path='/mySpace/myRequests' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<MyRequests/>} />} />
            <Route path='/mySpace/myRequests/:id' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<RequestItem/>} />} />
            <Route path='/mySpace/newRequest' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<MySpaceNewRequestPage/>} />} />
            <Route path='/mySpace/notifications' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Notifications/>} />} />
            <Route path='newRequest' element={<NewRequests/>} />
            <Route path='/account' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<AccountPage/>} />} />
            <Route path='/account/settings' element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<SettingsAccountPage/>} />} />
        </Routes>
    )
}

export default Home;