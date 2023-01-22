import React, {FC} from "react";
import Header from "./header/Header";
import Navbar from "./navbar/Navbar";
import {Route, Routes} from "react-router-dom";
import MainPage from "../mainPageSections/mainPage/MainPage";
import MyRequests from "./myRequests/MyRequests";
import NewRequests from "./newRequest/NewRequest";

const Home: FC = () => (
    <>
        <Header/>
        <Navbar/>
        <Routes>
            <Route path='/' element={<MainPage/>}/>
            <Route path='myRequests' element={<MyRequests/>}/>
            <Route path='newRequest' element={<NewRequests/>}/>
        </Routes>
    </>
)

export default Home;