export type Expense = {
    expense_id: string,
    user_id: string,
    title: string,
    category: string,
    date: Date,
    amount: number;

};

export type ExpenseSummary = {
    category: string;
    totalAmount: number;
};

export interface DateOption {
    display: string;
    value: string;
}

export interface StandardResponse<T> {
    success: boolean;
    data: T;
}

export type barChartData = {
    data: number[];
    label: string;
    backgroundColor: string[];
};

export type pieChartData = {
    data: number[];
    backgroundColor: string[];
};