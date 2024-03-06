import React, { useEffect, useRef, useState } from 'react';
import classes from './Expense.module.css';

const Expense = () => {
  const textInputRef = useRef();
  const amountInputRef = useRef();
  const descriptionInputRef = useRef();
  const categoryInputRef = useRef();
  const [expenses, setExpenses] = useState([]);

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
      setExpenses(storedExpenses);
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

      setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
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

      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.text !== text),
      );
      localStorage.setItem(
        'expenses',
        JSON.stringify(expenses.filter((expense) => expense.text !== text)),
      );

      console.log('Expense successfully deleted');
    } catch (error) {
      console.error('Error:', error.message);
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

  return (
    <section>
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
