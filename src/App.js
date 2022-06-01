import './App.module.css';
import Header from './components/header/Header';
import Navbar from './components/navbar/Navbar';
import MyRequests from './components/myRequests/MyRequests';
import NewRequests from './components/newRequest/NewRequest';
import Chat from './components/chat/Chat';
import Settings from './components/settings/Settings';
import Menu from './components/menu/Menu';
import {BrowserRouter, Route} from 'react-router-dom';
import Login from "./components/login/Login";

const App = (props) => {

    const isAuth = false;

    return (
        <>
            {!isAuth ? (
                <Login/>
            ) : (
                <BrowserRouter>
                    <div>
                        <Header/>
                        <Navbar/>
                        <div>
                            <Route path='/menu' component={Menu}></Route>
                            <Route path='/myRequests' component={MyRequests}/>
                            <Route path='/newRequest' component={NewRequests}/>
                            <Route path='/chat' component={Chat}/>
                            <Route path='/settings' component={Settings}/>
                        </div>
                    </div>
                </BrowserRouter>
            )
            }
        </>
    )
}

export default App;