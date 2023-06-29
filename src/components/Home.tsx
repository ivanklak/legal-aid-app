import React, {FC} from "react";
import Header from "./header/Header";
import Navbar from "./navbar/Navbar";
import {Route, Routes} from "react-router-dom";
import MainPage from "../mainPageSections/mainPage/MainPage";
import MyRequests from "./myRequests/MyRequests";
import NewRequests from "../newRequest/NewRequest";
import Notifications from "../notifications/Notifications";
import Categories from "../categories/Categories";
import ContentBody from "./contentBody/ContentBody";
import RequestItem from "../requestItem/RequestItem";

const Home: FC = () => (
    <>
        <Header/>
        <ContentBody>
            <Navbar/>
            <Routes>
                <Route path='/' element={<MainPage/>}/>
                <Route path='category' element={<Categories/>} />
                <Route path='myRequests' element={<MyRequests/>}/>
                <Route path='myRequests/:id' element={<RequestItem/>}/>
                <Route path='newRequest' element={<NewRequests/>}/>
                <Route path='notifications' element={<Notifications/>} />
            </Routes>
        </ContentBody>
    </>
)

export default Home;