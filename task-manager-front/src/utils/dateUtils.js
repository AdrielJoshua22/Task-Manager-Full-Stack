export const getCurrentDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

export const getTasksByDate = (tasks, currentDate, dayNum) => {
  if (!tasks || !Array.isArray(tasks)) return [];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const cellDate = new Date(year, month, dayNum);
  cellDate.setHours(0, 0, 0, 0);

  return tasks.filter(task => {
    if (!task.startDate) return false;

    const taskDate = new Date(task.startDate);
    const normalizedTaskDate = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
    normalizedTaskDate.setHours(0, 0, 0, 0);

    if (cellDate < normalizedTaskDate) return false;

    const freq = task.frecuencia || 'NUNCA';
    const cellTime = cellDate.getTime();
    const taskTime = normalizedTaskDate.getTime();

    switch (freq) {
      case 'NUNCA':
        return cellTime === taskTime;
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