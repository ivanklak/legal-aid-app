import './App.module.css';
import {Routes, Route} from 'react-router-dom';
import Login from "./components/login/Login";
import RequireAuth from "./components/RequireAuth";
import Home from "./components/Home";
import Missing from "./components/Missing";
import Menu from "./components/menu/Menu";
import MyRequests from "./components/myRequests/MyRequests";
import NewRequests from "./components/newRequest/NewRequest";
import Chat from "./components/chat/Chat";
import Settings from "./components/settings/Settings";
import React from "react";

const App = (props) => {

    return (
        <Routes>
            <Route path="login" element={<Login/>}/>
            <Route element={<RequireAuth/>}>
                <Route path='/' element={<Home/>}>
                    <Route path='menu' element={<Menu/>}/>
                    <Route path='myRequests' element={<MyRequests/>}/>
                    <Route path='newRequest' element={<NewRequests/>}/>
                    <Route path='chat' element={<Chat/>}/>
                    <Route path='settings' element={<Settings/>}/>
                    <Route path="*" element={<Missing/>}/>
                </Route>
            </Route>
        </Routes>
    )
}

export default App;