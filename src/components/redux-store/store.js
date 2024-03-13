import { configureStore } from '@reduxjs/toolkit';
import expenseReducer from './expenseSlice';
import themeReducer from './ThemeReducer';

const store = configureStore({
  reducer: {
    expense: expenseReducer,
    theme: themeReducer,
  },
});

export default store;
