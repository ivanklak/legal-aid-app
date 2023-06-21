import React, {FC} from "react";
import {Route, Routes} from 'react-router-dom';
import Login from "../login/Login";
import Unauthorized from "../components/Unauthorized";
import Home from "../components/Home";
import Missing from "../components/Missing";

const AppRoutes: FC = () => (
    <Routes>
        <Route path="login" element={<Login/>} />
        <Route path="unauthorized" element={<Unauthorized/>} />
        <Route path="/*" element={<Home/>}/>
        <Route path="*" element={<Missing/>}/>
    </Routes>
)

export default AppRoutes;
