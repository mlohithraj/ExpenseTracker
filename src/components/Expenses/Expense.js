import React, { useRef } from 'react';
import classes from './Expense.module.css';

const Expense = () => {
  const textInputRef = useRef();
  const amountInputRef = useRef();
  const descriptionInputRef = useRef();
  const categoryInputRef = useRef();
  const expensesListRef = useRef([]);

  const addExpenseHandler = (event) => {
    event.preventDefault();
    const text = textInputRef.current.value;
    const amount = amountInputRef.current.value;
    const description = descriptionInputRef.current.value;
    const category = categoryInputRef.current.value;

    const newExpense = {
      id: Math.random().toString(),
      text: text,
      amount: +amount,
      description: description,
      category: category,
    };

    expensesListRef.current.push(newExpense);

    textInputRef.current.value = '';
    amountInputRef.current.value = '';
    descriptionInputRef.current.value = '';
    categoryInputRef.current.value = '';

    forceUpdate();
  };

  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);

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
          {expensesListRef.current.map((expense) => (
            <li key={expense.id}>
              <div>{expense.text}</div>
              <div>{expense.amount}</div>
              <div>{expense.description}</div>
              <div>{expense.category}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Expense;
