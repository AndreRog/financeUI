import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";
import Expenses from "../screens/home/Expenses.tsx";

const queryClient = new QueryClient();

const HomePage : React.FunctionComponent = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Expenses />
        </QueryClientProvider>
    )
}
export default HomePage;