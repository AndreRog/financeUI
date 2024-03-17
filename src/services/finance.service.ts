export enum BankType {
    SANTANDER = "SANTANDER",
    CGD = "CGD",
    REVOLUT = "REVOLUT"
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
