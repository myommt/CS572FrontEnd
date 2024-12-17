export type Budget = {
    budget_id: string,
    user_id: string,
    title: string,
    category: string,
    date: Date,
    amount: number;

};

export type BudgetSummary = {
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