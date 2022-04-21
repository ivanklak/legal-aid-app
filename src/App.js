import logo from './logo.svg';
import './App.module.css';
import {useContext} from "react";
import Header from './components/header/Header';
import Navbar from './components/navbar/Navbar';
import Section from './components/section/Section';
import myRequests from './MyRequests';
import newRequests from './NewRequest';
import Chat from './Chat';
import Settings from './Settings';
import Menu from './Menu';

import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import {NavbarContext} from "./context/NavbarContext";

function App() {

    return (
        <>
            <Navbar/>
            <NavbarContext.Provider value=>
                <Header/>
            </NavbarContext.Provider>
            <Section/>
            <Router>
                <Switch>
                    <Route path='/menu' component={Menu}/>
                    <Route path='/myRequests' component={myRequests}/>
                    <Route path='/newRequest' component={newRequests}/>
                    <Route path='/chat' component={Chat}/>
                    <Route path='/settings' component={Settings}/>
                </Switch>
            </Router>
        </>
    );
}

export default App;