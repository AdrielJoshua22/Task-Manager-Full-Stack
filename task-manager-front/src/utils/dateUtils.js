export const getCurrentDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

export const getTasksByDate = (tasks, currentDate, dayNum) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const cellDate = new Date(year, month, dayNum);

  return tasks.filter(task => {
    if (!task.startDate) return false;
    const taskDate = new Date(task.startDate);
    const normalizedTaskDate = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());

    if (cellDate < normalizedTaskDate) return false;

    const freq = task.frecuencia || 'NUNCA';
    switch (freq) {
      case 'NUNCA':
        return cellDate.getTime() === normalizedTaskDate.getTime();
      case 'DIARIA':
        return true;
      case 'SEMANAL':
        return taskDate.getDay() === cellDate.getDay();
      case 'MENSUAL':
        return taskDate.getDate() === cellDate.getDate();
      default:
        return false;
    }
  });
};