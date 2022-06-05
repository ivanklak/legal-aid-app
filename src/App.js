import './App.module.css';
import {Routes, Route} from 'react-router-dom';
import Login from "./components/login/Login";
import RequireAuth from "./components/RequireAuth";
import Home from "./components/Home";

const App = (props) => {

    return (
        <Routes>
            <Route path="login" element={<Login/>}/>
            <Route element={<RequireAuth/>}>
                <Route path='/' element={<Home/>}/>
            </Route>
        </Routes>
    )
}

export default App;