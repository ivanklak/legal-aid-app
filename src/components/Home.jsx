import React from "react";
import Header from "./header/Header";
import Navbar from "./navbar/Navbar";
import {Route, Routes} from "react-router-dom";
import Menu from "./menu/Menu";
import MyRequests from "./myRequests/MyRequests";
import NewRequests from "./newRequest/NewRequest";
import Chat from "./chat/Chat";
import Settings from "./settings/Settings";

const Home = () => {

    return (
        <section>
            <Header/>
            <Navbar/>
            <Routes>
                <Route path='menu' element={<Menu/>}/>
                <Route path='myRequests' element={<MyRequests/>}/>
                <Route path='newRequest' element={<NewRequests/>}/>
                <Route path='chat' element={<Chat/>}/>
                <Route path='settings' element={<Settings/>}/>
            </Routes>
        </section>
    );
}

export default Home;