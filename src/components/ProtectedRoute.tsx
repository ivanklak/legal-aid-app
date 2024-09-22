import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import Navbar from "./navbar/Navbar";
import ContentBody from "./contentBody/ContentBody";

export type ProtectedRouteProps = {
    isAuthenticated: boolean;
    authenticationPath: string;
    redirectPath: string;
    setRedirectPath: (path: string) => void;
    outlet: JSX.Element;
};

export default function ProtectedRoute({isAuthenticated, authenticationPath, redirectPath, setRedirectPath, outlet}: ProtectedRouteProps) {
    const currentLocation = useLocation();

    useEffect(() => {
        if (!isAuthenticated) {
            setRedirectPath(currentLocation.pathname);
        }
    }, [isAuthenticated, setRedirectPath, currentLocation]);

    if (isAuthenticated && redirectPath === currentLocation.pathname) {
        return (
            <ContentBody>
                <Navbar/>
                {outlet}
            </ContentBody>
        );
    } else {
        return <Navigate to={{ pathname: isAuthenticated ? redirectPath : authenticationPath }} />;
    }
};