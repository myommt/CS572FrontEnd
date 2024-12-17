import { Budget } from "../budget/budget.type";
import { Expense } from "../expenses/expense.type";

export interface CombinedResults {
    expenses: Expense[];
    budgets: Budget[];
}

export interface SummaryResponse {
    combinedResults: CombinedResults;
    summary: string;
}