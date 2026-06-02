import * as React from 'react';
import Keycloak from 'keycloak-js';

const useKeycloak = () => {
    const kc = new Keycloak( {
        url: "http://localhost:8080",
        realm: "moneymind",
        clientId: "money_mind_ui" }
    );

    const [keycloak, setKeycloak] = React.useState< Keycloak | undefined >( undefined );
    const [authenticated, setAuthenticated] = React.useState< boolean >(false)
    const [error, setError] = React.useState< Error | undefined >( undefined )

    const onReady = ( authenticated: boolean ) => {
        setKeycloak( kc )
        setAuthenticated( authenticated )

        if ( ! authenticated ) {
           return kc.login();
        }

        return Promise.resolve()
    }

    const registerEventListeners = () => {
        kc.onReady = onReady
        kc.onAuthError = () => {
            kc.clearToken()
        }
        kc.onAuthLogout = () => {
            setAuthenticated( false );
            kc.logout();
        }
//        kc.onAuthSuccess = () => {
//            updateToken( kc.token )
//        }
        kc.onTokenExpired = () => {
            // this will try to auto renew the token on expiration
            // required refresh tokens setup on keycloak
            kc.updateToken(70)
                .catch( (e) => {
                    console.error( 'error refreshing token', e )
                })
        }
//        kc.onAuthRefreshSuccess = () => {
//            updateToken( kc.token )
//        }
        kc.onAuthRefreshError = () => {
            kc.clearToken();
        }
    }

    React.useEffect( () => {
        const init = async () => {
            registerEventListeners()
            await kc.init( );
            setError( undefined )
        }

        init().catch( e => { setError( e ) } )
    }, [] )

    return {
        authenticated,
        error,
        instance: keycloak
    }
}

export default useKeycloak;
