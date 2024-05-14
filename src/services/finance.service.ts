export enum BankType {
    SANTANDER = "SANTANDER",
    'CAIXA GERAL DEPOSITOS' = "CAIXA GERAL DEPOSITOS",
    'ACTIV BANK' = "ACTIV BANK"
}

export interface Expense {
    id: number;
    type: string;
    value: number;
    date: string;
}

export async function getBankTypes() : Promise<BankType[]>{
    try {
        const response = await fetch('http://localhost:8080/finance/banks');
        if (response.ok) {
            const bankTypes: string[] = await response.json();
            return bankTypes.map((bankType) => BankType[bankType as keyof typeof BankType]);
        } else {
            console.error('Failed to fetch bank options');
            return [];
        }
    } catch (error) {
        console.error('Error fetching bank options:', error);
        return [];
    }
}


export async function getExpenses(): Promise<Expense[]> {
    return [
        {
            id: 0,
            type: 'Supermercado',
            value: 10,
            date: '01-01-2024'
        },
        {
            id: 1,
            type: 'NetFlix',
            value: 15,
            date: '01-02-2024'
        },
        {
            id: 2,
            type: 'AmazonPrime',
            value: 20,
            date: '01-03-2024'
        }
    ]
}