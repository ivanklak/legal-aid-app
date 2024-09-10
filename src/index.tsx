import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {HashRouter} from "react-router-dom";
import './index.css';
import App from './App';

ReactDOM.render(
    <HashRouter>
        <App />
    </HashRouter>,
    document.getElementById('root')
);
