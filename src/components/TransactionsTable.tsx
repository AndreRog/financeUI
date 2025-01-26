import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    TablePagination,
    Paper,
    Typography,
    Select,
    Box,
    TableFooter, FormControl, InputLabel, MenuItem,
} from "@mui/material";
import { Transaction } from "../services/transactions.service.ts";

interface TransactionTable {
    bankName: string;
    date: string;
    description: string;
    amount: number;
    finalBalance: number;
    category: string | null;
}

export interface SearchTransactions {
    next: string,
    _embedded: Transaction[];
}

interface TransactionsTableProps {
    transactions: SearchTransactions;
    categories: string[] | undefined;
    onCategoryUpdate: (id: string, category: string) => Promise<void>;
    next: (url: string) => void;
    back: () => void;
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
    transactions, categories, onCategoryUpdate, next, back
}) => {
    const [order, setOrder] = useState<"asc" | "desc">("asc");
    const [orderBy, setOrderBy] = useState<keyof TransactionTable>("date");

    const handleSort = (property: keyof TransactionTable) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleCategoryChange = (txId: string, category: string) => {
        console.log(`Category: ${category}`);
        onCategoryUpdate(txId, category);
    };

    const sortedData = transactions?._embedded.slice().sort((a, b) => {
        if (orderBy === "date") {
            return order === "asc"
                ? new Date(a?.date).getTime() - new Date(b?.date).getTime()
                : new Date(b?.date).getTime() - new Date(a?.date).getTime();
        } else if (orderBy === "amount") {
            return order === "asc" ? a?.amount - b?.amount : b.amount - a.amount;
        }
        return 0;
    });

    return (
        <Paper>
            <Typography variant="h6" component="div" sx={{ padding: 2 }}>
                Transactions
            </Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Bank Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "date"}
                                    direction={orderBy === "date" ? order : "asc"}
                                    onClick={() => handleSort("date")}
                                >
                                    Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === "amount"}
                                    direction={orderBy === "amount" ? order : "asc"}
                                    onClick={() => handleSort("amount")}
                                >
                                    Amount
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Final Balance</TableCell>
                            <TableCell>Category</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedData.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.bankName}</TableCell>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>
                                    {new Date(transaction.date).toLocaleDateString()}
                                </TableCell>
                                <TableCell>{transaction.amount.toFixed(2)}</TableCell>
                                <TableCell>{transaction.finalBalance.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Box display="flex" alignItems="center">
                                        <FormControl fullWidth>
                                            <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                            <Select
                                                labelId="category-selector"
                                                id="category-selector"
                                                value={transaction.category ? transaction.category : ""}
                                                label="Category"
                                                onChange={(e) => {
                                                    handleCategoryChange(transaction.id, e.target.value);
                                                }}
                                            >
                                                {
                                                    categories ?
                                                    categories.map((category) => (
                                                        <MenuItem value={category} key={category}>{category}</MenuItem>
                                                    )) :
                                                        null
                                                }
                                            </Select>
                                        </FormControl>
                                    </Box>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={6} sx={{ padding: 0 }}>
                                <TablePagination
                                    component="div"
                                    rowsPerPageOptions={[]}
                                    count={-1} // No total count available
                                    rowsPerPage={10} // Fixed page size
                                    page={0} // Current page is managed via `onNavigate` and backend
                                    labelDisplayedRows={() => ""}
                                    onPageChange={(_, direction) => {
                                        if (direction === -1) {
                                            back();
                                        } else if (direction === 1 && transactions.next) {
                                            next(transactions.next);
                                        }
                                    }}
                                    slotProps={{
                                        actions: {
                                            nextButton: {
                                                disabled: !transactions.next,
                                            },
                                        },
                                    }}
                                    sx={{
                                        "& .MuiTablePagination-actions": {
                                            justifyContent: "flex-end", // Aligns pagination controls to the end
                                        },
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Paper>
    );
};

export default TransactionsTable;
