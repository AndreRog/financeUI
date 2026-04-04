import { PieChart } from '@mui/x-charts/PieChart';
import {
        SearchExpenses,
        Transaction,
        getExpenses,
        updateTx,
        getCategories,
        importTransactions,
        ImportResponse,
        ClassifiedTransaction
} from "../../services/transactions.service.ts";
import {
        TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
        Button, Snackbar, Alert, CircularProgress, Dialog, DialogTitle, DialogContent,
        DialogActions, Typography, Chip, Box, Divider, LinearProgress, IconButton
} from '@mui/material';
import { CloudUpload, CheckCircle, Category as CategoryIcon, TrendingUp, Check } from '@mui/icons-material';
import TransactionsTable from '../../components/TransactionsTable';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from "react-router";
import LineStackBarChart, { MonthlyFinanceData } from '../../components/LineStackBarChart';
import { useState, useMemo, useRef } from 'react';

// Helper function to format date in European format DD-MM-YYYY
const formatDateEuropean = (dateString: string): string => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
};

// Date range options
type DateRangeOption = 'last12months' | '2024' | '2023' | '2022';

interface DateRange {
        startDate: string;
        endDate: string;
        label: string;
}

const getDateRange = (option: DateRangeOption): DateRange => {
        const now = new Date();

        switch (option) {
                case 'last12months': {
                        const endDate = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0));
                        const startDate = new Date(Date.UTC(now.getFullYear() - 1, now.getMonth(), 1, 0, 0, 0));
                        return {
                                startDate: startDate.toISOString(),
                                endDate: endDate.toISOString(),
                                label: 'Last 12 Months'
                        };
                }
                case '2024':
                        return {
                                startDate: new Date(Date.UTC(2024, 0, 1, 0, 0, 0)).toISOString(),
                                endDate: new Date(Date.UTC(2024, 11, 31, 23, 59, 59)).toISOString(),
                                label: '2024'
                        };
                case '2023':
                        return {
                                startDate: new Date(Date.UTC(2023, 0, 1, 0, 0, 0)).toISOString(),
                                endDate: new Date(Date.UTC(2023, 11, 31, 23, 59, 59)).toISOString(),
                                label: '2023'
                        };
                case '2022':
                        return {
                                startDate: new Date(Date.UTC(2022, 0, 1, 0, 0, 0)).toISOString(),
                                endDate: new Date(Date.UTC(2022, 11, 31, 23, 59, 59)).toISOString(),
                                label: '2022'
                        };
                default:
                        return getDateRange('last12months');
        }
};

const Expenses = () => {
        const navigate = useNavigate();
        const queryClient = useQueryClient();

        // Extract cursor from the URL query parameters
        const [URLParams, setURLParams] = useSearchParams();

        // Date range selection state
        const [selectedPeriod, setSelectedPeriod] = useState<DateRangeOption>('last12months');

        // Import file state
        const fileInputRef = useRef<HTMLInputElement>(null);
        const [importing, setImporting] = useState(false);
        const [bankType, setBankType] = useState<string>('CAIXAGERALDEPOSITOS');
        const [importResults, setImportResults] = useState<ImportResponse | null>(null);
        const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
        const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
                open: false,
                message: '',
                severity: 'success'
        });

        // Track category selections and applied state for each imported transaction
        const [categorySelections, setCategorySelections] = useState<Record<number, string>>({});
        const [appliedTransactions, setAppliedTransactions] = useState<Set<number>>(new Set());
        const [applyingTransaction, setApplyingTransaction] = useState<number | null>(null);

        // Calculate date range based on selection
        const dateRange = useMemo(() => getDateRange(selectedPeriod), [selectedPeriod]);
        const { startDate, endDate, label: periodLabel } = dateRange;

        const noDimension: string[] = [];
        const categoryDimension: string[] = ['category'];
        const cursor = URLParams.get("cursor") || "";

        const handlePeriodChange = (event: SelectChangeEvent) => {
                setSelectedPeriod(event.target.value as DateRangeOption);
        };

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

        // Fetch all transactions for the year (for the monthly chart)
        const { data: allTransactions, isError: allTransactionsError, isLoading: allTransactionsLoading } = useQuery({
                queryKey: ["allTransactions", startDate, endDate], // The query key
                queryFn: async () => {
                        // Fetch all transactions without cursor limit for chart data
                        let allTxs: Transaction[] = [];
                        let currentCursor = "";
                        let hasMore = true;

                        // Keep fetching until we have all transactions
                        while (hasMore) {
                                const response = await getExpenses(startDate, endDate, noDimension, currentCursor);
                                const transactions = response._embedded as Transaction[];
                                allTxs = [...allTxs, ...transactions];

                                // Check if there's a next page
                                if (response.next && response.next.href && response.next.href.trim().length > 0) {
                                        const url = new URL(response.next.href);
                                        const nextCursor = url.searchParams.get('cursor');
                                        if (nextCursor) {
                                                currentCursor = nextCursor;
                                        } else {
                                                hasMore = false;
                                        }
                                } else {
                                        hasMore = false;
                                }
                        }

                        return allTxs;
                },
                staleTime: 60000, // 1 minute
                refetchOnWindowFocus: false, // Don't refetch this on focus as it can be expensive
        });

        const navigateBack = () => {
                navigate(-1);
        }

        const navigateTo = (to: string) => {
                const url: URL = new URL(to);
                const nextCursor = url.searchParams.get('cursor');
                if (nextCursor) {
                        URLParams.set("cursor", nextCursor);
                        setURLParams(URLParams);
                }
        }

        const categoryUpdate = async (txId: string, category: string) => {
                const transactions: Transaction[] = transactionsList?._embedded as Transaction[];
                let tx: Transaction | undefined = transactions.find(tx => tx.id === txId);

                if (tx === undefined) {
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

        const handleImportClick = () => {
                fileInputRef.current?.click();
        };

        const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                if (!file) return;

                setImporting(true);
                try {
                        const result = await importTransactions(file, bankType);

                        if (result.success && result.data) {
                                // Store results and show dialog
                                setImportResults(result.data);
                                setResultsDialogOpen(true);

                                // Refetch all queries to show updated data
                                queryClient.invalidateQueries({ queryKey: ['transactions'] });
                                queryClient.invalidateQueries({ queryKey: ['allTransactions'] });
                        } else {
                                setSnackbar({
                                        open: true,
                                        message: result.message || 'Failed to import transactions',
                                        severity: 'error'
                                });
                        }
                } catch (error) {
                        setSnackbar({
                                open: true,
                                message: 'An error occurred while importing transactions',
                                severity: 'error'
                        });
                } finally {
                        setImporting(false);
                        // Reset file input
                        if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                        }
                }
        };

        const handleBankTypeChange = (event: SelectChangeEvent) => {
                setBankType(event.target.value);
        };

        const handleCloseSnackbar = () => {
                setSnackbar({ ...snackbar, open: false });
        };

        const handleCloseResultsDialog = () => {
                setResultsDialogOpen(false);
                // Reset category selections and applied state
                setCategorySelections({});
                setAppliedTransactions(new Set());
        };

        const handleCategorySelectionChange = (index: number, category: string) => {
                setCategorySelections(prev => ({
                        ...prev,
                        [index]: category
                }));
        };

        const handleApplyCategory = async (index: number, item: ClassifiedTransaction) => {
                if (!item.record.id) {
                        setSnackbar({
                                open: true,
                                message: 'Cannot update transaction without ID',
                                severity: 'error'
                        });
                        return;
                }

                setApplyingTransaction(index);
                try {
                        // Get the selected category or use the ML prediction
                        const selectedCategory = categorySelections[index] || item.category;

                        // Create updated transaction
                        const updatedTx: Transaction = {
                                ...item.record,
                                category: selectedCategory
                        };

                        await updateTx(updatedTx);

                        // Mark as applied
                        setAppliedTransactions(prev => new Set(prev).add(index));

                        setSnackbar({
                                open: true,
                                message: `Category "${selectedCategory}" applied successfully`,
                                severity: 'success'
                        });

                        // Refetch transactions to show updated data
                        queryClient.invalidateQueries({ queryKey: ['transactions'] });
                } catch (error) {
                        setSnackbar({
                                open: true,
                                message: 'Failed to update category',
                                severity: 'error'
                        });
                } finally {
                        setApplyingTransaction(null);
                }
        };

        const handleApplyAll = async () => {
                if (!importResults?._embedded) return;

                setImporting(true);
                let successCount = 0;
                let errorCount = 0;

                for (let index = 0; index < importResults._embedded.length; index++) {
                        const item = importResults._embedded[index];

                        // Skip if already applied or no ID
                        if (appliedTransactions.has(index) || !item.record.id) continue;

                        try {
                                const selectedCategory = categorySelections[index] || item.category;
                                const updatedTx: Transaction = {
                                        ...item.record,
                                        category: selectedCategory
                                };

                                await updateTx(updatedTx);
                                setAppliedTransactions(prev => new Set(prev).add(index));
                                successCount++;
                        } catch (error) {
                                errorCount++;
                        }
                }

                setImporting(false);

                // Show summary
                if (errorCount === 0) {
                        setSnackbar({
                                open: true,
                                message: `Successfully applied ${successCount} categories`,
                                severity: 'success'
                        });
                } else {
                        setSnackbar({
                                open: true,
                                message: `Applied ${successCount} categories, ${errorCount} failed`,
                                severity: 'warning'
                        });
                }

                // Refetch transactions to show updated data
                queryClient.invalidateQueries({ queryKey: ['transactions'] });
        };

        // Compute summary once when importResults changes
        const importSummary = useMemo(() => {
                console.log("=== IMPORT SUMMARY COMPUTATION ===");
                console.log("importResults:", importResults);

                if (!importResults) {
                        console.log("❌ importResults is null/undefined");
                        return null;
                }

                if (!importResults._embedded) {
                        console.log("❌ importResults._embedded is missing");
                        console.log("Available keys:", Object.keys(importResults));
                        return null;
                }

                console.log("✓ Computing import summary");
                const transactions = importResults._embedded;
                console.log("Transactions type:", typeof transactions);
                console.log("Is array:", Array.isArray(transactions));

                if (!Array.isArray(transactions)) {
                        console.log("❌ _embedded is not an array:", transactions);
                        return null;
                }

                if (transactions.length === 0) {
                        console.log("❌ Transactions array is empty");
                        return null;
                }

                console.log("Processing", transactions.length, "transactions");
                const total = transactions.length;

                // Group by category
                const categoryStats: Record<string, { count: number; avgConfidence: number; total: number }> = {};

                transactions.forEach(item => {
                        const cat = item.category || 'UNCATEGORIZED';
                        if (!categoryStats[cat]) {
                                categoryStats[cat] = { count: 0, avgConfidence: 0, total: 0 };
                        }
                        categoryStats[cat].count++;
                        categoryStats[cat].total += item.classificationConfidence;
                });

                // Calculate averages
                Object.keys(categoryStats).forEach(cat => {
                        categoryStats[cat].avgConfidence = categoryStats[cat].total / categoryStats[cat].count;
                });

                // Sort by count descending
                const sortedCategories = Object.entries(categoryStats)
                        .sort((a, b) => b[1].count - a[1].count)
                        .map(([category, stats]) => ({
                                category,
                                count: stats.count,
                                avgConfidence: stats.avgConfidence
                        }));

                const summary = {
                        total,
                        categories: sortedCategories,
                        avgConfidence: transactions.reduce((sum, item) => sum + item.classificationConfidence, 0) / total
                };

                console.log("✅ Successfully computed summary:", summary);
                console.log("=================================");
                return summary;
        }, [importResults]);

        const toSearchTransactions = (data: SearchExpenses | undefined) => {
                if (!data) {
                        return {
                                next: "",
                                _embedded: []
                        };
                }

                return {
                        next: data.next?.href || "",
                        _embedded: data._embedded as Transaction[]
                }
        }

        const toPieChart = (data: SearchExpenses | undefined) => {
                if (!data || !data._embedded) {
                        return [];
                }
                console.log(`data of request`);
                console.log(data);

                // Check if the data is already grouped (Dimension[]) or individual transactions (Transaction[])
                const firstItem = data._embedded[0];

                // If it has a 'dimension' property, it's a Dimension object (already grouped)
                if (firstItem && 'dimension' in firstItem) {
                        const dimensionsArray = data._embedded as { dimension: string; name: string; value: number }[];
                        return dimensionsArray.map((dim, index) => ({
                                id: dim.name || `category-${index}`,
                                label: dim.name || 'NONE',
                                value: Math.abs(dim.value)
                        }));
                } else {
                        // Otherwise, it's Transaction[] (needs grouping)
                        const transactionsArray = data._embedded as Transaction[];
                        const grouped: Record<string, number> = {};

                        transactionsArray.forEach((tx: Transaction) => {
                                const category = tx.category || 'NONE';
                                grouped[category] = (grouped[category] || 0) + Math.abs(tx.amount);
                        });

                        return Object.entries(grouped).map(([category, value]) => ({
                                id: category,
                                label: category,
                                value: value
                        }));
                }
        }

        const toMonthlyChartData = (transactions: Transaction[] | undefined): MonthlyFinanceData[] => {
                if (!transactions || transactions.length === 0) {
                        return [];
                }

                console.log('Processing transactions for chart:', transactions.length);
                console.log('Sample transaction:', transactions[0]);

                // Group transactions by month
                const monthlyData: Record<string, {
                        income: number,
                        expenseCategories: Record<string, number>,
                        totalExpenses: number
                }> = {};

                transactions.forEach(tx => {
                        // Parse the transaction date
                        const date = new Date(tx.date);
                        const monthKey = `${date.toLocaleString('en-US', { month: 'short' })} ${date.getFullYear()}`;

                        // Initialize month if it doesn't exist
                        if (!monthlyData[monthKey]) {
                                monthlyData[monthKey] = {
                                        income: 0,
                                        expenseCategories: {},
                                        totalExpenses: 0
                                };
                        }

                        const category = tx.category || 'Uncategorized';
                        const amount = tx.amount;

                        if (amount > 0) {
                                // Income (positive amounts)
                                monthlyData[monthKey].income += amount;
                        } else if (amount < 0) {
                                // Expenses (negative amounts)
                                const absAmount = Math.abs(amount);

                                if (!monthlyData[monthKey].expenseCategories[category]) {
                                        monthlyData[monthKey].expenseCategories[category] = 0;
                                }
                                monthlyData[monthKey].expenseCategories[category] += absAmount;
                                monthlyData[monthKey].totalExpenses += absAmount;
                        }
                });

                // Convert to array and sort by date
                const result: MonthlyFinanceData[] = Object.keys(monthlyData)
                        .map(month => ({
                                month,
                                income: monthlyData[month].income,
                                expenseCategories: monthlyData[month].expenseCategories,
                                totalExpenses: monthlyData[month].totalExpenses,
                                savings: monthlyData[month].income - monthlyData[month].totalExpenses
                        }))
                        .sort((a, b) => {
                                // Parse dates for sorting
                                const dateA = new Date(a.month);
                                const dateB = new Date(b.month);
                                return dateA.getTime() - dateB.getTime();
                        });

                console.log('Monthly chart data:', result);
                return result;
        }


        const sizing = {
                //  margin: { bottom: 2 },
                width: 400,
                height: 200,
                // legend: { hidden: true },
        };

        if (transactionsListLoading || allTransactionsLoading) return <div>Loading...</div>;
        if (transactionListError) return <div>Error: {transactionListError ? transactionListError : "Unknown error"}</div>;
        if (allTransactionsError) return <div>Error loading chart data</div>;

        return (

                <div className='column center'>
                        {/* Hidden file input */}
                        <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".csv,.xlsx,.xls"
                                style={{ display: 'none' }}
                        />

                        {/* Import Controls and Period Selector */}
                        <div className='w-full mb-4 flex justify-between items-center gap-3'>
                                {/* Left side: Import controls */}
                                <div className='flex items-center gap-3'>
                                        <FormControl
                                                size="small"
                                                sx={{
                                                        minWidth: 220,
                                                        '& .MuiOutlinedInput-root': {
                                                                borderRadius: '8px',
                                                                '&:hover fieldset': {
                                                                        borderColor: '#2196F3',
                                                                },
                                                                '&.Mui-focused fieldset': {
                                                                        borderColor: '#2196F3',
                                                                        borderWidth: '2px',
                                                                }
                                                        }
                                                }}
                                        >
                                                <InputLabel id="bank-type-label">Bank Type</InputLabel>
                                                <Select
                                                        labelId="bank-type-label"
                                                        id="bank-type-select"
                                                        value={bankType}
                                                        label="Bank Type"
                                                        onChange={handleBankTypeChange}
                                                        disabled={importing}
                                                >
                                                        <MenuItem value="CAIXAGERALDEPOSITOS">Caixa Geral de Depósitos</MenuItem>
                                                </Select>
                                        </FormControl>

                                        <Button
                                                variant="contained"
                                                startIcon={importing ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                                                onClick={handleImportClick}
                                                disabled={importing}
                                                sx={{
                                                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                                                        boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        padding: '8px 24px',
                                                        borderRadius: '8px',
                                                        textTransform: 'none',
                                                        fontSize: '0.95rem',
                                                        '&:hover': {
                                                                background: 'linear-gradient(45deg, #1976D2 30%, #00BCD4 90%)',
                                                                boxShadow: '0 4px 6px 2px rgba(33, 203, 243, .4)',
                                                        },
                                                        '&:disabled': {
                                                                background: 'linear-gradient(45deg, #BDBDBD 30%, #9E9E9E 90%)',
                                                        }
                                                }}
                                        >
                                                {importing ? 'Importing...' : 'Import Transactions'}
                                        </Button>
                                </div>

                                {/* Right side: Period selector */}
                                <FormControl size="small" sx={{ minWidth: 180 }}>
                                        <InputLabel id="period-select-label">Period</InputLabel>
                                        <Select
                                                labelId="period-select-label"
                                                id="period-select"
                                                value={selectedPeriod}
                                                label="Period"
                                                onChange={handlePeriodChange}
                                        >
                                                <MenuItem value="last12months">Last 12 Months</MenuItem>
                                                <MenuItem value="2024">2024</MenuItem>
                                                <MenuItem value="2023">2023</MenuItem>
                                                <MenuItem value="2022">2022</MenuItem>
                                        </Select>
                                </FormControl>
                        </div>

                        {/* Monthly Finance Overview - Income, Expenses (stacked), Savings */}
                        <div className='w-full mb-8'>
                                <LineStackBarChart
                                        data={toMonthlyChartData(allTransactions)}
                                        title={`Monthly Finance Overview (${periodLabel})`}
                                />
                        </div>

                        {/* Pie Chart - Expenses by Category */}
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
                        <div>

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

                        {/* Import Results Dialog */}
                        <Dialog
                                open={resultsDialogOpen}
                                onClose={handleCloseResultsDialog}
                                maxWidth="md"
                                fullWidth
                                PaperProps={{
                                        sx: {
                                                borderRadius: '16px',
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        }
                                }}
                        >
                                <DialogTitle sx={{ color: 'white', pb: 1 }}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                                <CheckCircle sx={{ fontSize: 32 }} />
                                                <Typography variant="h5" fontWeight="bold">
                                                        Import Successful!
                                                </Typography>
                                        </Box>
                                </DialogTitle>
                                <DialogContent sx={{ bgcolor: 'white', mx: 3, mb: 3, borderRadius: '12px', p: 3 }}>
                                        {importSummary ? (
                                                <Box>
                                                        {/* Summary Stats */}
                                                        <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                                                                <Chip
                                                                        icon={<TrendingUp />}
                                                                        label={`${importSummary.total} Transactions`}
                                                                        color="primary"
                                                                        sx={{ fontSize: '1rem', py: 2.5, px: 1, fontWeight: 'bold' }}
                                                                />
                                                                <Chip
                                                                        icon={<CategoryIcon />}
                                                                        label={`${importSummary.categories.length} Categories`}
                                                                        color="secondary"
                                                                        sx={{ fontSize: '1rem', py: 2.5, px: 1, fontWeight: 'bold' }}
                                                                />
                                                                <Chip
                                                                        label={`${(importSummary.avgConfidence * 100).toFixed(1)}% Avg Confidence`}
                                                                        sx={{
                                                                                fontSize: '1rem',
                                                                                py: 2.5,
                                                                                px: 1,
                                                                                fontWeight: 'bold',
                                                                                bgcolor: '#4caf50',
                                                                                color: 'white'
                                                                        }}
                                                                />
                                                        </Box>

                                                        <Divider sx={{ my: 2 }} />

                                                        {/* Transaction Details */}
                                                        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                                                                Imported Transactions
                                                        </Typography>
                                                        <Box sx={{ maxHeight: '400px', overflowY: 'auto', pr: 1 }}>
                                                                {importResults?._embedded.map((item, index) => (
                                                                        <Box
                                                                                key={index}
                                                                                sx={{
                                                                                        p: 2,
                                                                                        mb: 1.5,
                                                                                        border: '1px solid #e0e0e0',
                                                                                        borderRadius: '8px',
                                                                                        '&:hover': {
                                                                                                bgcolor: '#f5f5f5',
                                                                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                                                        }
                                                                                }}
                                                                        >
                                                                                {/* Top row: Description and Amount */}
                                                                                <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                                                                                        <Typography variant="body1" fontWeight="600" sx={{ flex: 1, mr: 2 }}>
                                                                                                {item.record.description}
                                                                                        </Typography>
                                                                                        <Typography
                                                                                                variant="h6"
                                                                                                fontWeight="bold"
                                                                                                sx={{
                                                                                                        color: item.record.amount >= 0 ? '#4caf50' : '#f44336',
                                                                                                        whiteSpace: 'nowrap'
                                                                                                }}
                                                                                        >
                                                                                                {item.record.amount >= 0 ? '+' : ''}{item.record.amount.toFixed(2)}€
                                                                                        </Typography>
                                                                                </Box>

                                                                                {/* Bottom row: Category selector, Apply button, and Confidence */}
                                                                                <Box display="flex" justifyContent="space-between" alignItems="center" gap={1.5}>
                                                                                        {/* Category selector */}
                                                                                        <FormControl size="small" sx={{ minWidth: 150, flex: 1 }}>
                                                                                                <InputLabel id={`category-label-${index}`}>Category</InputLabel>
                                                                                                <Select
                                                                                                        labelId={`category-label-${index}`}
                                                                                                        id={`category-select-${index}`}
                                                                                                        value={categorySelections[index] || item.category || ''}
                                                                                                        label="Category"
                                                                                                        onChange={(e) => handleCategorySelectionChange(index, e.target.value)}
                                                                                                        disabled={appliedTransactions.has(index)}
                                                                                                        sx={{
                                                                                                                bgcolor: appliedTransactions.has(index) ? '#e8f5e9' : 'white'
                                                                                                        }}
                                                                                                >
                                                                                                        {categories?.map((cat) => (
                                                                                                                <MenuItem key={cat} value={cat}>
                                                                                                                        {cat}
                                                                                                                </MenuItem>
                                                                                                        ))}
                                                                                                </Select>
                                                                                        </FormControl>

                                                                                        {/* Apply button */}
                                                                                        {!appliedTransactions.has(index) ? (
                                                                                                <Button
                                                                                                        variant="contained"
                                                                                                        size="small"
                                                                                                        onClick={() => handleApplyCategory(index, item)}
                                                                                                        disabled={applyingTransaction === index || !item.record.id}
                                                                                                        sx={{
                                                                                                                minWidth: '80px',
                                                                                                                bgcolor: '#667eea',
                                                                                                                '&:hover': { bgcolor: '#5568d3' }
                                                                                                        }}
                                                                                                >
                                                                                                        {applyingTransaction === index ? (
                                                                                                                <CircularProgress size={20} color="inherit" />
                                                                                                        ) : (
                                                                                                                'Apply'
                                                                                                        )}
                                                                                                </Button>
                                                                                        ) : (
                                                                                                <Chip
                                                                                                        icon={<CheckCircle />}
                                                                                                        label="Applied"
                                                                                                        size="small"
                                                                                                        sx={{
                                                                                                                bgcolor: '#4caf50',
                                                                                                                color: 'white',
                                                                                                                fontWeight: 'bold'
                                                                                                        }}
                                                                                                />
                                                                                        )}

                                                                                        {/* Confidence chip */}
                                                                                        <Box display="flex" alignItems="center" gap={0.5}>
                                                                                                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                                                                                                        Conf:
                                                                                                </Typography>
                                                                                                <Chip
                                                                                                        label={`${(item.classificationConfidence * 100).toFixed(0)}%`}
                                                                                                        size="small"
                                                                                                        sx={{
                                                                                                                bgcolor: item.classificationConfidence > 0.7 ? '#4caf50' :
                                                                                                                        item.classificationConfidence > 0.5 ? '#ff9800' : '#f44336',
                                                                                                                color: 'white',
                                                                                                                fontWeight: 'bold',
                                                                                                                fontSize: '0.7rem'
                                                                                                        }}
                                                                                                />
                                                                                        </Box>
                                                                                </Box>

                                                                                {/* Date */}
                                                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                                                        {formatDateEuropean(item.record.date)}
                                                                                </Typography>
                                                                        </Box>
                                                                ))}
                                                        </Box>
                                                </Box>
                                        ) : (
                                                <Box textAlign="center" py={4}>
                                                        <Typography variant="body1" color="text.secondary">
                                                                No transaction data available
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                                                                Please check the console for debugging information
                                                        </Typography>
                                                </Box>
                                        )}
                                </DialogContent>
                                <DialogActions sx={{ bgcolor: 'white', mx: 3, mb: 3, pt: 0, borderRadius: '0 0 12px 12px', justifyContent: 'space-between' }}>
                                        <Button
                                                onClick={handleApplyAll}
                                                variant="contained"
                                                disabled={importing || !importResults?._embedded ||
                                                        appliedTransactions.size === importResults._embedded.filter(item => item.record.id).length}
                                                startIcon={importing ? <CircularProgress size={20} color="inherit" /> : <Check />}
                                                sx={{
                                                        background: 'linear-gradient(45deg, #4caf50 30%, #45a049 90%)',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        px: 4,
                                                        '&:hover': {
                                                                background: 'linear-gradient(45deg, #45a049 30%, #3d8b40 90%)',
                                                        },
                                                        '&:disabled': {
                                                                background: 'linear-gradient(45deg, #BDBDBD 30%, #9E9E9E 90%)',
                                                        }
                                                }}
                                        >
                                                {importing ? 'Applying...' : 'Apply All Predictions'}
                                        </Button>
                                        <Button
                                                onClick={handleCloseResultsDialog}
                                                variant="contained"
                                                sx={{
                                                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                                        color: 'white',
                                                        fontWeight: 'bold',
                                                        px: 4,
                                                        '&:hover': {
                                                                background: 'linear-gradient(45deg, #5568d3 30%, #653a8b 90%)',
                                                        }
                                                }}
                                        >
                                                Close
                                        </Button>
                                </DialogActions>
                        </Dialog>

                        {/* Snackbar for notifications */}
                        <Snackbar
                                open={snackbar.open}
                                autoHideDuration={6000}
                                onClose={handleCloseSnackbar}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                        >
                                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                                        {snackbar.message}
                                </Alert>
                        </Snackbar>
                </div>

        )
}

export default Expenses;
