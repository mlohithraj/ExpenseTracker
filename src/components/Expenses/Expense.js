import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import {
  addExpense,
  deleteExpense,
  editExpense,
  setExpenses,
} from '../redux-store/expenseSlice';
import classes from './Expense.module.css';

const Expense = () => {
  const [premiumActivated, setPremiumActivated] = useState(false);
  const textInputRef = useRef();
  const amountInputRef = useRef();
  const descriptionInputRef = useRef();
  const categoryInputRef = useRef();

  const expenses = useSelector((state) => state.expense.expenses);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      let storedExpenses = localStorage.getItem('expenses');
      if (!storedExpenses) {
        const response = await fetch(
          'https://expense-tracker-c30e4-default-rtdb.asia-southeast1.firebasedatabase.app/expense-tracker.json',
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

    try {
      const response = await fetch(
        'https://expense-tracker-c30e4-default-rtdb.asia-southeast1.firebasedatabase.app/expense-tracker.json',
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

  const deleteExpenseHandler = async (text) => {
    try {
      const response = await fetch(
        `https://expense-tracker-c30e4-default-rtdb.asia-southeast1.firebasedatabase.app/expense-tracker/${text}.json`,
        {
          method: 'DELETE',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to delete expense');
      }

      dispatch(deleteExpense(text));
      localStorage.setItem(
        'expenses',
        JSON.stringify(expenses.filter((expense) => expense.text !== text)),
        alert('Are you sure? You want to delete'),
      );

      console.log('Expense successfully deleted');
    } catch (error) {
      alert('Error:', error.message);
    }
  };

  const editExpenseHandler = async (text) => {
    const expenseToEdit = expenses.find((expense) => expense.text === text);

    textInputRef.current.value = expenseToEdit.text;
    amountInputRef.current.value = expenseToEdit.amount;
    descriptionInputRef.current.value = expenseToEdit.description;
    categoryInputRef.current.value = expenseToEdit.category;

    await deleteExpenseHandler(text);
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
        <ul className={classes.expense} id="expenses-list">
          {expenses.map((expense) => (
            <li key={expense.text}>
              <div>Text: {expense.text}</div>
              <div>Price: {expense.amount}</div>
              <div>Description: {expense.description}</div>
              <div>Category: {expense.category}</div>
              <div className={classes.button}>
                <button
                  onClick={() => deleteExpenseHandler(expense.text)}
                  className={classes.action}
                >
                  Delete
                </button>
                <nobr />
                <button
                  onClick={() => editExpenseHandler(expense.text)}
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
