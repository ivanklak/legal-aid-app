import React, {ComponentType, FC, useContext} from 'react';
import AuthContext from "../Layers/AuthProvider";
import Login from "../../login/Login";

function withAuthRedirect<P>(WrappedComponent: ComponentType<P>) {
    const RedirectComponent: FC<P> = props => {
        const { isAuth } = useContext(AuthContext);

        return isAuth ? <WrappedComponent {...props} /> : <Login />;
    }

    return RedirectComponent;
}

export default withAuthRedirect;