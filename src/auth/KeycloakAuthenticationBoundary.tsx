import React, {PropsWithChildren} from "react";

import Keycloak from 'keycloak-js';
import AuthenticationContext from "./AuthContext.tsx";
import useKeycloak from "./useKeycloak.ts";
import AuthenticationBoundary from "./AuthenticationBoundary.tsx";

// @ts-ignore
const keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "my-realm",
    clientId: "my-app"
});

const KeycloakAuthenticationBoundary: React.FC<PropsWithChildren> = (props) => {
    // @ts-ignore
    const { authenticated, error, instance }  = useKeycloak();
    if (authenticated) {
        console.log('User is authenticated');
    } else {
        console.log('User is not authenticated');
    }

    return <AuthenticationContext.Provider value={ { authenticated, error } }>
        <AuthenticationBoundary >
            { props.children }
        </AuthenticationBoundary>
    </AuthenticationContext.Provider>

}
export default KeycloakAuthenticationBoundary;
