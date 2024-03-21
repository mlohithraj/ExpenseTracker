import React, { useContext, useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
  addExpense,
  deleteExpense,
  editExpense,
  setExpenses,
} from '../redux-store/expenseSlice';
import AuthContext from '../store/auth-context';
import classes from './Expense.module.css';

const Expense = () => {
  const [premiumActivated, setPremiumActivated] = useState(false);
  const textInputRef = useRef();
  const amountInputRef = useRef();
  const descriptionInputRef = useRef();
  const categoryInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const expenses = useSelector((state) => state.expense.expenses);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const email = authCtx.userEmail.replace(/[.@]/g, '');
    try {
      let storedExpenses = localStorage.getItem('expenses');
      if (!storedExpenses) {
        const response = await fetch(
          `https://expense-tracker-c30e4-default-rtdb.asia-southeast1.firebasedatabase.app/${email}/expense-tracker.json`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch expense data');
        }

        const data = await response.json();
        if (data) {
          storedExpenses = Object.values(data);
          localStorage.setItem('expenses', JSON.stringify(storedExpenses));
        }
      } else {
        storedExpenses = JSON.parse(storedExpenses);
      }
      dispatch(setExpenses(storedExpenses));
    } catch (error) {
      alert('Error:', error.message);
    }
  };

  const addExpenseHandler = async (event) => {
    event.preventDefault();
    const text = textInputRef.current.value;
    const amount = amountInputRef.current.value;
    const description = descriptionInputRef.current.value;
    const category = categoryInputRef.current.value;

    const newExpense = {
      text: text,
      amount: +amount,
      description: description,
      category: category,
    };

    const email = authCtx.userEmail.replace(/[@.]/g, '');

    try {
      const response = await fetch(
        `https://expense-tracker-c30e4-default-rtdb.asia-southeast1.firebasedatabase.app/${email}/expense-tracker.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newExpense),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to save expense data');
      }

      const data = await response.json();
      newExpense.id = data.name;

      dispatch(addExpense(newExpense));
      localStorage.setItem(
        'expenses',
        JSON.stringify([...expenses, newExpense]),
      );
    } catch (error) {
      alert('Error:', error.message);
    }

    textInputRef.current.value = '';
    amountInputRef.current.value = '';
    descriptionInputRef.current.value = '';
    categoryInputRef.current.value = '';
  };

  const deleteExpenseHandler = async (id) => {
    const email = authCtx.userEmail.replace(/[@.]/g, '');

    try {
      const response = await fetch(
        `https://expense-tracker-c30e4-default-rtdb.asia-southeast1.firebasedatabase.app/${id}/expense-tracker.json`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      dispatch(deleteExpense(id));
      localStorage.setItem(
        'expenses',
        JSON.stringify(expenses.filter((expense) => expense.id !== id)),
      );
    } catch (error) {
      alert('Error:', error.message);
    }
  };

  const editExpenseHandler = async (id) => {
    const expenseToEdit = expenses.find((expense) => expense.id === id);

    textInputRef.current.value = expenseToEdit.text;
    amountInputRef.current.value = expenseToEdit.amount;
    descriptionInputRef.current.value = expenseToEdit.description;
    categoryInputRef.current.value = expenseToEdit.category;

    // Submit the edited expense data
    const editedExpense = {
      text: textInputRef.current.value,
      amount: +amountInputRef.current.value,
      description: descriptionInputRef.current.value,
      category: categoryInputRef.current.value,
    };

    // Dispatch the editExpense action to update the expense in Redux state
    dispatch(editExpense({ id, editedExpense }));

    // Delete the original expense from the database
    await deleteExpenseHandler(id);
  };

  const totalAmount = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const downloadExpensesAsPDF = () => {
    const input = document.getElementById('expenses-list');

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 0, 0);
      pdf.save('expenses.pdf');
    });
  };

  const activatePremium = () => {
    setPremiumActivated(true);
  };

  const downloadFile = () => {
    const download = document.getElementsByClassName('download')[0];
    const blob = new Blob([JSON.stringify(expenses)], { type: 'text/plain' });
    download.href = URL.createObjectURL(blob);
  };

  return (
    <section>
      <div className={classes.premiumBtn}>
        {totalAmount > 10000 && (
          <button className={classes.premiumButton} onClick={activatePremium}>
            Activate Premium
          </button>
        )}
        {premiumActivated && (
          <a
            href="#"
            className="download"
            download="expenses.txt"
            onClick={downloadFile}
          >
            Download File
          </a>
        )}
      </div>
      <form onSubmit={addExpenseHandler} className={classes.form}>
        <div className={classes.control}>
          <label>Enter Text</label>
          <input type="text" ref={textInputRef} placeholder="Text" required />
        </div>
        <div className={classes.control}>
          <label>Amount</label>
          <input
            type="number"
            ref={amountInputRef}
            placeholder="Enter Amount"
            required
          />
        </div>
        <div className={classes.control}>
          <label>Description</label>
          <textarea
            ref={descriptionInputRef}
            placeholder="Describe here"
            required
          />
        </div>
        <div className={classes.control}>
          <label>Category</label>
          <select ref={categoryInputRef}>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Salary">Salary</option>
          </select>
        </div>
        <button type="submit" className={classes.action}>
          Add Expense
        </button>
      </form>
      <div>
        <h2>Expenses</h2>
        <ul className={classes.expense}>
          {expenses.map((expense) => (
            <li key={expense.id}>
              <div>Text: {expense.text}</div>
              <div>Price: {expense.amount}</div>
              <div>Description: {expense.description}</div>
              <div>Category: {expense.category}</div>
              <div className={classes.button}>
                <button
                  onClick={() => deleteExpenseHandler(expense.id)}
                  className={classes.action}
                >
                  Delete
                </button>
                <nobr />
                <button
                  onClick={() => editExpenseHandler(expense.id)}
                  className={classes.action}
                >
                  Edit
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Expense;
