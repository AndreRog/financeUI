import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import KeycloakAuthenticationBoundary from "./auth/KeycloakAuthenticationBoundary.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import HomePage from "./pages/home.tsx";
import {ThemeProviderContext} from "./assets/theme/ThemeProviderContext.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
       <ThemeProviderContext>
            <BrowserRouter>
                {/*<KeycloakAuthenticationBoundary>*/}
                    <Routes>
                        <Route path="/" element={ <HomePage/> }/>
                    </Routes>
                {/*</KeycloakAuthenticationBoundary>*/}
            </BrowserRouter>
       </ThemeProviderContext>
    </React.StrictMode>,
)
