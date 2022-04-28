import React, {useContext} from "react";
import styles from '../../App.module.css';
import NavbarContext from "../../context/NavbarContext";

const Chat = (props) => {

    const {isNavbarClose} = useContext(NavbarContext);

    return (
        <>
            <section className={`${styles.home_content} ${+' ' + isNavbarClose ? styles.width : ''}`}>
                <h1>Chat</h1>
            </section>
        </>
    );
}

export default Chat;