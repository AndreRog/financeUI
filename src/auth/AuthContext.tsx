import React from "react";

export interface Context {
    authenticated: boolean
    error?: Error
}

export const AuthenticationContext = React.createContext< Context >({ authenticated: false } )

export const useAuthentication = () => React.useContext( AuthenticationContext )

export default AuthenticationContext;
