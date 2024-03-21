import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    addExpense(state, action) {
      state.expenses.push(action.payload);
    },
    deleteExpense(state, action) {
      state.expenses = state.expenses.filter(
        (expense) => expense.id !== action.payload,
      );
    },
    editExpense(state, action) {
      const index = state.expenses.findIndex(
        (expense) => expense.id === action.payload.id,
      );
      state.expenses[index] = action.payload;
    },
    setExpenses(state, action) {
      state.expenses = action.payload;
    },
  },
});

export const { addExpense, deleteExpense, editExpense, setExpenses } =
  expenseSlice.actions;

export default expenseSlice.reducer;
