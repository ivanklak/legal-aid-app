import React, {ComponentType, FC, useContext} from 'react';
import {useLocation} from "react-router-dom";
import AuthContext from "../Layers/AuthProvider";
import Login from "../../components/login/Login";

function withAuthRedirect<P>(WrappedComponent: ComponentType<P>) {
    const RedirectComponent: FC<P> = props => {
        const location = useLocation();
        const { auth } = useContext(AuthContext);

        // auth?.auth?.roles?.find((role) => { return allowedRoles?.includes(role)})

        return auth ? <WrappedComponent {...props} /> : <Login />;
    }

    return RedirectComponent;
}

export default withAuthRedirect;