import React from "react";
import './App.module.css';
import {Route, Routes} from 'react-router-dom';
import Login from "./components/login/Login";
import RequireAuth from "./components/RequireAuth";
import Home from "./components/Home";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";

const OldApp = () => {

    const ROLES = {
        'User': 'USER',
        'Editor': 'Editor',
        'Admin': 'Admin'
    }

    return (
        <Routes>
            {/* public */}
            <Route path="login" element={<Login/>}></Route>
            <Route path="unauthorized" element={<Unauthorized/>}></Route>
            {/* private */}
            <Route element={<RequireAuth allowedRoles={[ROLES.User]}/>}>
                <Route path='/*' element={<Home/>}/>
            </Route>

            <Route path="*" element={<Missing/>}/>
        </Routes>
    )
}

export default OldApp;