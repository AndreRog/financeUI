import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    TooltipItem,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export interface MonthlyFinanceData {
    month: string; // e.g., "Jan 2025", "Feb 2025"
    income: number; // Total income for the month
    expenseCategories: Record<string, number>; // e.g., { "Food": 150, "Transport": 50 }
    totalExpenses: number; // Total expenses (sum of all categories)
    savings: number; // Income - Expenses
}

interface StackedBarChartProps {
    data: MonthlyFinanceData[];
    title?: string;
}

// Color palette for expense categories
const EXPENSE_COLOR_PALETTE = [
    'rgba(239, 68, 68, 0.85)',   // red-500
    'rgba(220, 38, 38, 0.85)',   // red-600
    'rgba(185, 28, 28, 0.85)',   // red-700
    'rgba(248, 113, 113, 0.85)', // red-400
    'rgba(252, 165, 165, 0.85)', // red-300
    'rgba(254, 202, 202, 0.85)', // red-200
    'rgba(153, 27, 27, 0.85)',   // red-800
    'rgba(239, 68, 68, 0.6)',    // red-500 lighter
    'rgba(220, 38, 38, 0.6)',    // red-600 lighter
    'rgba(185, 28, 28, 0.6)',    // red-700 lighter
];

const INCOME_COLOR = 'rgba(34, 197, 94, 0.85)';  // green-500
const SAVINGS_COLOR = 'rgba(59, 130, 246, 0.85)'; // blue-500

const LineStackBarChart: React.FC<StackedBarChartProps> = ({ data, title = "Monthly Overview" }) => {
    // Extract all unique expense categories across all months
    const allCategories = Array.from(
        new Set(
            data.flatMap(monthData => Object.keys(monthData.expenseCategories))
        )
    );

    // Generate colors for categories
    const categoryColors: Record<string, string> = {};
    allCategories.forEach((category, index) => {
        categoryColors[category] = EXPENSE_COLOR_PALETTE[index % EXPENSE_COLOR_PALETTE.length];
    });

    // Income bar dataset (simple bar, not stacked with expenses)
    const incomeDataset = {
        label: 'Income',
        data: data.map(monthData => monthData.income),
        backgroundColor: INCOME_COLOR,
        stack: 'income',
        barPercentage: 0.8,
        categoryPercentage: 0.9,
    };

    // Expense category datasets (stacked together)
    // First category shows in legend as "Expenses", others are hidden
    const expenseDatasets = allCategories.map((category, index) => ({
        label: index === 0 ? 'Expenses' : category,
        data: data.map(monthData => monthData.expenseCategories[category] || 0),
        backgroundColor: categoryColors[category],
        stack: 'expenses',
        barPercentage: 0.8,
        categoryPercentage: 0.9,
        // Hide all category labels from legend except the first one (which shows "Expenses")
        hidden: false,
        // Store the actual category name for tooltip
        categoryName: category,
    }));

    // Savings bar dataset (simple bar, not stacked)
    const savingsDataset = {
        label: 'Savings',
        data: data.map(monthData => monthData.savings),
        backgroundColor: SAVINGS_COLOR,
        stack: 'savings',
        barPercentage: 0.8,
        categoryPercentage: 0.9,
    };

    const chartData = {
        labels: data.map(monthData => monthData.month),
        datasets: [incomeDataset, ...expenseDatasets, savingsDataset],
    };

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'nearest' as const,
            intersect: true,
        },
        plugins: {
            title: {
                display: !!title,
                text: title,
                font: {
                    size: 16,
                    weight: 'bold',
                },
            },
            legend: {
                display: true,
                position: 'top' as const,
                labels: {
                    filter: (legendItem) => {
                        // Only show Income, Expenses, and Savings in the legend
                        return legendItem.text === 'Income' ||
                               legendItem.text === 'Expenses' ||
                               legendItem.text === 'Savings';
                    },
                },
            },
            tooltip: {
                callbacks: {
                    title: (tooltipItems: TooltipItem<'bar'>[]) => {
                        if (tooltipItems.length === 0) return '';
                        const item = tooltipItems[0];
                        const dataset = item.dataset as typeof expenseDatasets[0];

                        // For expenses, show category name as title
                        if (dataset.stack === 'expenses' && 'categoryName' in dataset) {
                            return `${dataset.categoryName}`;
                        }
                        return item.dataset.label || '';
                    },
                    label: (context: TooltipItem<'bar'>) => {
                        const value = context.parsed.y;
                        return `€${value.toFixed(2)}`;
                    },
                },
            },
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    display: false,
                },
            },
            y: {
                stacked: true,
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return '€' + value;
                    },
                },
            },
        },
    };

    return (
        <div style={{ width: '100%', height: '400px' }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default LineStackBarChart;
