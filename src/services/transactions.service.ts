export enum BankType {
        SANTANDER = "SANTANDER",
        'CAIXA GERAL DEPOSITOS' = "CAIXA GERAL DEPOSITOS",
        'ACTIV BANK' = "ACTIV BANK"
}

export interface AggregatedResult {
        period: string | null;
        groupKey: string | null;
        total: number;
}

export interface Transaction {
        id: string;
        category: string;
        bankName: string;
        sub_category: string;
        date: string;
        description: string,
        amount: number,
        finalBalance: number,
}

export interface SearchExpenses {
        next: {
                href: string;
        }
        data: Transaction[] | AggregatedResult[];
}

export interface ClassifiedTransaction {
        category: string;
        classificationConfidence: number;
        record: Transaction;
}

export interface ImportResponse {
        next: {
                href: string;
        }
        data: ClassifiedTransaction[];
}



const API_URL: URL = new URL(await import.meta.env.VITE_API_URL);

export async function getBankTypes(): Promise<BankType[]> {
        try {
                const response = await fetch(`${API_URL}/banks`);
                if (response.ok) {
                        //const bankTypes = await response.json();
                        return [];
                        //return bankTypes.map((bankType) => BankType[bankType as keyof typeof BankType]);
                } else {
                        console.error('Failed to fetch bank options');
                        return [];
                }
        } catch (error) {
                console.error('Error fetching bank options:', error);
                return [];
        }
}

export const getExpenses = async (from: string, to: string, dimensions: string[],
        cursor: string): Promise<SearchExpenses> => {
        console.log(`Log add parameters: ${cursor}`);
        try {
                const searchUrl: URL = new URL(`${API_URL}/transactions`);
                let urlSearchParams = searchUrl.searchParams;

                if (from && from.trim().length > 0) {
                        urlSearchParams.append("from", from);
                }

                if (to && to.trim().length > 0) {
                        urlSearchParams.append("to", to);
                }

                if (dimensions && dimensions.length > 0) {
                        urlSearchParams.append("dimension", dimensions.join(","));
                }

                if (cursor && cursor.trim().length > 0) {
                        urlSearchParams.append("cursor", cursor);
                }
                console.log(`Cursor URL: ${searchUrl}`);

                const response = await fetch(searchUrl);
                if (response.ok) {
                        const transactions: SearchExpenses = await response.json();
                        console.log(transactions);
                        return transactions;
                }
        } catch (error) {
                console.error('Error fetching bank options:', error);
        }
        return {
                next: {
                        href: ""
                }, data: []
        };
}

export const updateTx = async (updatedTx: Transaction | undefined): Promise<void> => {
        try {
                if (!updatedTx) {
                        console.error('Failed to update transaction since it was undefined');
                        return;
                }
                console.debug(`Updated tx: ${JSON.stringify(updatedTx)}`);
                const body = { category: updatedTx.category }

                const response = await fetch(`${API_URL}/transactions/${updatedTx.id}`, {
                        method: 'PATCH',
                        headers: {
                                'Content-Type': 'application/json',
                                // Add any additional headers like authorization if needed
                                // 'Authorization': `Bearer ${yourAuthToken}`
                        },
                        body: JSON.stringify(body)
                });

                if (!response.ok) {
                        console.error(`Error updating resource: ${JSON.stringify(updatedTx)}`);
                }
        } catch (error) {
                console.error('Error updating resource:', error);
                throw error;
        }
}

export interface Category {
        id: string;
        name: string;
        type: 'INCOME' | 'EXPENSE' | 'EXCLUDED';
        subcategories: Category[];
}

export const getCategories = async (): Promise<string[]> => {
        try {
                const response = await fetch(`${API_URL}/categories`);
                if (response.ok) {
                        const categories: Category[] = await response.json();
                        // Backend now returns a 2-level Category tree; the assignable
                        // values for tagging a transaction are the subcategory names.
                        return categories.flatMap(c => c.subcategories).map(s => s.name);
                } else {
                        return [];
                }
        } catch (error) {
                console.error('Error fetching categories:', error);
        }
        return [];
}

export const importTransactions = async (file: File, type: string): Promise<{ success: boolean; data?: ImportResponse; message?: string }> => {
        try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', type);

                const response = await fetch(`${API_URL}/transactions`, {
                        method: 'POST',
                        body: formData
                });

                if (response.status === 201 || response.ok) {
                        const rawResult = await response.json();
                        console.log("=== IMPORT RESPONSE ===")
                        console.log("Raw response:", rawResult)
                        console.log("Is array:", Array.isArray(rawResult))

                        // Backend returns an array directly, not wrapped in an object
                        // Wrap it in the expected ImportResponse structure
                        const result: ImportResponse = Array.isArray(rawResult)
                                ? { next: { href: "" }, data: rawResult }
                                : rawResult;

                        console.log("Normalized result:", result)
                        console.log("Has data:", !!result.data)
                        console.log("data length:", result.data?.length)
                        console.log("======================")
                        return { success: true, data: result };
                } else {
                        const errorText = await response.text();
                        return { success: false, message: errorText || 'Failed to import transactions' };
                }
        } catch (error) {
                console.error('Error importing transactions:', error);
                return { success: false, message: error instanceof Error ? error.message : 'Unknown error occurred' };
        }
}
