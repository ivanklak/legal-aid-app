import {useContext} from "react";
import AuthContext from "../Layers/AuthProvider";

export const useAuth = () => useContext(AuthContext);