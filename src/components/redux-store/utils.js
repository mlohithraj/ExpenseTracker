// // utils.js
// export const downloadExpensesAsCSV = (expenses) => {
//   const csvContent = 'Text,Amount,Description,Category\n';
//   expenses.forEach((expense) => {
//     csvContent += `${expense.text},${expense.amount},${expense.description},${expense.category}\n`;
//   });

//   const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
//   const link = document.createElement('a');
//   link.href = window.URL.createObjectURL(blob);
//   link.setAttribute('download', 'expenses.csv');
//   document.body.appendChild(link);
//   link.click();
// };
