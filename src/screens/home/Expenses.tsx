
import React, { useState, useEffect } from 'react';
import { PieChart, pieArcLabelClasses  } from '@mui/x-charts/PieChart';
import { Expense, getExpenses } from "../../services/finance.service";
import '../../assets/home.css'; // Importing the CSS file


const Expenses = () => {


    interface IDataItem {
        id: number,
        value: number
    }


    const [expensesArray, setExpensesSarray] = useState<IDataItem[]>([]);


    useEffect(() => {
        console.log('use effect ')
        getExpensesSeries();
    }, []);


    const getExpensesSeries = async () => {
        console.log(' running')
        const expenses: Expense[] = await getExpenses();

        const data = expenses.map((expense) => {
            return {
                id: expense.id,
                value: expense.value,
            }
        });

        console.log(data)

        setExpensesSarray(data);
        }

    const addExpense = () => {
        console.log("Add Expense");
    }

    return (

        <div className='column center'>
            <div className= 'column center' style={{ marginBottom: '1rem'}}>
                <PieChart
                    series={[
                        { 
                            data: expensesArray,
                        }
                    ]}
                    width={380}
                    height={200}
                />
            </div>
            

            <div className='row'>
                <input type="number" className='value-input'>
                </input>
                
                <button type="button" className='add-button' onClick={addExpense}>
                        Adicionar
                </button>
            </div>
        </div>

    )
}

export default Expenses;



