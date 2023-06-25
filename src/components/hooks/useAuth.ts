import {useContext} from "react";
import AuthContext from "../../App/Layers/AuthProvider";

export const useAuth = () => useContext(AuthContext);