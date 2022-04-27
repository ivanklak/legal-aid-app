import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import NavbarContext from "./context/NavbarContext";

function Main() {

    const [isNavbarClose, setClose] = useState(true);

    return (
        <React.StrictMode>
            <NavbarContext.Provider value={{isNavbarClose, setClose}}>
                <App />
            </NavbarContext.Provider>
        </React.StrictMode>
    );
}

ReactDOM.render(
  <Main />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
