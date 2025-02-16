import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  expenses: [],
  incomes: [],
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    addIncome: (state, action) => {
      state.incomes.push(action.payload);
    },
    deleteTransaction: (state, action) => {
      state.expenses = state.expenses.filter(item => item.id !== action.payload);
      state.incomes = state.incomes.filter(item => item.id !== action.payload);
    },
  },
});

export const { addExpense, addIncome, deleteTransaction } = transactionSlice.actions;
export default transactionSlice.reducer;
