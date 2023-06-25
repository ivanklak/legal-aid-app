import {useAuth} from "./hooks/useAuth";
import {useLocation, Navigate} from "react-router-dom";
import Home from "./Home";

const RequireAuth = ({allowedRoles}) => {
    const auth = useAuth();
    const location = useLocation();

    return (
        <>
        </>
        // // auth?.auth?.roles?.find(rol => allowedRoles?.includes(rol))
        // auth?.auth?.roles?.find((role) => { return allowedRoles?.includes(role)})
        //     ? <Home/>
        //     :
        //     auth?.auth.email
        //         ? <Navigate to="/unauthorized" state={{ from: location }} replace />
        //         : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;