import React, {useContext} from "react";
import styles from '../../App.module.css';
import NavbarContext from "../../App/context/NavbarContext";

const MyRequests = (props) => {

    const {isNavbarClose} = useContext(NavbarContext);

    return (
        <>
            <section className={`${styles.home_content} ${+' ' + isNavbarClose ? styles.width : ''}`}>
                <h1>My Requests</h1>
            </section>
        </>
    );
}

export default MyRequests;