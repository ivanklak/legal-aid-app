import useAuth from "./hooks/useAuth";
import {useLocation, Navigate, Outlet} from "react-router-dom";
import Home from "./Home";

const RequireAuth = () => {
    const {auth} = useAuth();
    const location = useLocation();

    return (
        auth?.email ? <Home/> : <Navigate to="/login" state={{ from: location}} replace/>
    );
}

export default RequireAuth;