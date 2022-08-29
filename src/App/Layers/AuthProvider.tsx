import React, {createContext, FC, useState} from "react";

export const AuthContext = createContext<any | undefined>(undefined);

export const AuthProvider: FC = ({ children }) => {
    const [auth, setAuth] = useState<any | undefined>();

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth
             }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext;