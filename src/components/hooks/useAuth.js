import {useContext} from "react";
import AuthContext from "../../App/Layers/AuthProvider";

const useAuth = () => {
    return useContext(AuthContext);
}
export default useAuth;