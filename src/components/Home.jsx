import React from "react";
import {Route, Routes} from "react-router-dom";
import Header from "./header/Header";
import Navbar from "./navbar/Navbar";
import Menu from "./menu/Menu";
import MyRequests from "./myRequests/MyRequests";
import NewRequests from "./newRequest/NewRequest";
import Chat from "./chat/Chat";
import Settings from "./settings/Settings";

const Home = () => {
    return (
        <Routes>
            <Route element={<Header/>}></Route>
            <Route element={<Navbar/>}></Route>
            <Route path='menu' element={<Menu/>}></Route>
            <Route path='myRequests' element={<MyRequests/>}/>
            <Route path='newRequest' element={<NewRequests/>}/>
            <Route path='chat' element={<Chat/>}/>
            <Route path='settings' element={<Settings/>}/>
        </Routes>
    );
}

export default Home;