import * as React from "react";
import {useAuthentication} from "./AuthContext.tsx";
import {PropsWithChildren} from "react";
import MaintenancePage from "../pages/MaintenancePage.tsx";
import InternalServerError from "../error/InternalServerError.tsx";
import UnauthorizedError from "../error/UnauthorizedError.tsx";

// The boundary should understand if it should show the children if and only if they are logged in.
const AuthenticationBoundary : React.FC<PropsWithChildren> = (props) => {

    const {authenticated, error} = useAuthentication();

    if(error) {
        return (
             <MaintenancePage>
                 <InternalServerError></InternalServerError>
             </MaintenancePage>
        )
    }

    // if not logged in redirect to login page.
    if(!authenticated) {
        // @ts-ignore
        return (
             <MaintenancePage>
                 <UnauthorizedError></UnauthorizedError>
             </MaintenancePage>
        )
    }

    return (
        <>
            { props.children }
        </>
    );
}
export default AuthenticationBoundary;
