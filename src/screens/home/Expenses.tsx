import { PieChart } from '@mui/x-charts/PieChart';
import {
    SearchExpenses,
    Transaction,
    getExpenses,
    updateTx,
    getCategories
} from "../../services/transactions.service.ts";
import {TextField } from '@mui/material';
import TransactionsTable from '../../components/TransactionsTable';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams} from "react-router";


const Expenses = () => {
    const navigate = useNavigate();

    // Extract cursor from the URL query parameters
    const [URLParams, setURLParams] = useSearchParams();

    // DO CALENDAR
    const startDate = new Date(Date.UTC(2024, 0, 1, 0, 0, 0)).toISOString();
    const endDate = new Date(Date.UTC(2024, 12, 1, 0, 0, 0)).toISOString();
    const noDimension: string[] = [];
    const categoryDimension: string[] = ['category'];
    const cursor = URLParams.get("cursor") || "";
    const limit = URLParams.get("limit") || "10";

    const { data: transactionsList, isError: transactionListError, isLoading: transactionsListLoading } = useQuery({
        queryKey: ["transactions", startDate, endDate, noDimension, cursor], // The query key
        queryFn: () => getExpenses(startDate, endDate, noDimension, cursor),
        staleTime: 0, // 1 minute
        refetchOnWindowFocus: true, // Refetch when the user focuses on the app   // The query function
    });


    const { data: txByCategories, isError: byCategoriesError, isLoading: byCategoriesLoading } = useQuery({
        queryKey: ["transactions", startDate, endDate, categoryDimension], // The query key
        queryFn: () => getExpenses(startDate, endDate, categoryDimension, ""),
        staleTime: 0, // 1 minute
        refetchOnWindowFocus: true, // Refetch when the user focuses on the app   // The query function
    });

    const { data: categories, isError: categoriesError, isLoading: categoriesLoading } = useQuery({
        queryKey: ["categories"], // The query key
        queryFn: () => getCategories(),
        staleTime: 0, // 1 minute
        refetchOnWindowFocus: true, // Refetch when the user focuses on the app   // The query function
    });

    const navigateBack = () => {
        navigate(-1);
    }

    const navigateTo = (to: string) => {
        const url: URL = new URL(to);
        const nextCursor = url.searchParams.get('cursor');
        if(nextCursor) {
            URLParams.set("cursor", nextCursor);
            setURLParams(URLParams);
        }
    }

    const categoryUpdate = async (txId: string, category: string) => {
        const transactions: Transaction[] = transactionsList?._embedded as Transaction[];
        let tx: Transaction | undefined = transactions.find(tx=> tx.id === txId);

        if(tx === undefined) {
            console.log(`Transaction not found ${JSON.stringify(tx)}`);
            return;
        }

        // @ts-ignore
        tx.category = category;
        await updateTx(tx);
    }

    const addExpense = () => {
        console.log("Add Expense");
    }

    const toSearchTransactions = (data: SearchExpenses | undefined) => {
        if (!data) {
            return {
                next: "",
                _embedded: []
            };
        }

        return {
            next: data.next.href,
            _embedded: data._embedded as Transaction[]
        }
    }

    const toPieChart = (data: SearchExpenses | undefined) => {
        if (!data) {
            return [];
        }
        console.log(`data of request`);
        console.log(data);
        const dimensionsArray: Transaction[] = data._embedded as Transaction[]

        let map = dimensionsArray.map((tx: Transaction) => {
            return {
                id: tx.category || 'NONE',
                label: tx.category || 'NONE',
                value: Math.abs(tx.amount)
            }
        });
        map.forEach(value => {
            console.log(value);
        })
        return map;
    }


    const sizing = {
        //  margin: { bottom: 2 },
        width: 400,
        height: 200,
        // legend: { hidden: true },
    };

    if (transactionsListLoading) return <div>Loading...</div>;
    if (transactionListError) return <div>Error: {transactionListError ? transactionListError: "Unknown error"}</div>;


    return (

        <div className='column center'>
            <div className='column center mb-8'>
                <PieChart
                    series={[
                        {
                            data: toPieChart(txByCategories),
                            //innerRadius: 10,
                            //outerRadius: 100,
                            //paddingAngle: 5,
                            //cornerRadius: 5,
                            //cx: 100,
                            //cy: 100,
                        }
                    ]}
                    {...sizing}
                />
            </div>


            <div className='flex flex-row justify-between col-span-3' >
                <TextField id="outlined-basic" label="Value" variant="outlined" className='col-span-2' />
                <button type="button" className="btn col-span-1 object-center" onClick={addExpense}>
                    ADD
                </button>
            </div>
            <TransactionsTable transactions={toSearchTransactions(transactionsList)}
                               next={navigateTo} back={navigateBack}
                               categories={categories} onCategoryUpdate={categoryUpdate}>

            </TransactionsTable>

            <div>

            </div>
        </div>

    )
}

export default Expenses;
