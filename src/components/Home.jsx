import React from "react";
import Header from "./header/Header";
import Navbar from "./navbar/Navbar";
import {Route, Routes} from "react-router-dom";
import Menu from "./menu/Menu";
import MyRequests from "./myRequests/MyRequests";
import NewRequests from "./newRequest/NewRequest";

const Home = () => (
    <>
        <Header/>
        <Navbar/>
        <Routes>
            <Route path='menu' element={<Menu/>}/>
            <Route path='myRequests' element={<MyRequests/>}/>
            <Route path='newRequest' element={<NewRequests/>}/>
        </Routes>
    </>
)

export default Home;