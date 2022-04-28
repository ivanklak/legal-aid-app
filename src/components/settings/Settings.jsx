import React, {useContext} from "react";
import styles from '../../App.module.css';
import NavbarContext from "../../context/NavbarContext";

const NewRequests = (props) => {

    const {isNavbarClose} = useContext(NavbarContext);

    return (
        <>
            <section className={`${styles.home_content} ${+' ' + isNavbarClose ? styles.width : ''}`}>
                <h1>Settings</h1>
            </section>
        </>
    );
}

export default NewRequests;