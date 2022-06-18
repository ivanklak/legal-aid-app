import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import NavbarContext from "./context/NavbarContext";
import {AuthProvider} from "./context/AuthProvider";
import {BrowserRouter, Routes, Route} from 'react-router-dom';

function Main() {

    const [isNavbarClose, setClose] = useState(true);

    return (
        <React.StrictMode>
            <BrowserRouter>
                <AuthProvider>
                    <NavbarContext.Provider value={{isNavbarClose, setClose}}>
                        <Routes>
                            <Route path='/*' element={<App/>}/>
                        </Routes>
                    </NavbarContext.Provider>
                </AuthProvider>
            </BrowserRouter>
        </React.StrictMode>
    );
}

ReactDOM.render(
    <Main/>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
