import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TaskDetailsModal from './TaskDetailsModal';
import DailyView from './DailyView';
import Footer from './Footer';
import { solicitarPermisosYGuardarToken } from '../services/notificationService';

const api = axios.create({
  baseURL: 'https://task-manager-full-stack-production.up.railway.app/api/tasks'
});

const Dashboard = ({ currentUser, onLogout }) => {
  const [taskForm, setTaskForm] = useState({
    title: '',
    startDate: '',
    frecuencia: 'NUNCA'
  });

  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [selectedDateView, setSelectedDateView] = useState(null);
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));

  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  useEffect(() => {
    setTaskForm(prev => ({ ...prev, startDate: getCurrentDateTime() }));
  }, []);

  useEffect(() => {
    if (currentUser) {
      solicitarPermisosYGuardarToken(currentUser);
    }
  }, [currentUser]);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get(`/user/${currentUser}`);
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      setTasks([]);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async () => {
    if (!taskForm.title.trim()) return alert("Escribe un título");
    try {
      await api.post(`/${currentUser}`, { ...taskForm, description: "", completed: false });
      setTaskForm({ title: '', startDate: getCurrentDateTime(), frecuencia: 'NUNCA' });
      fetchTasks();
    } catch (error) {}
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("¿Borrar tarea?")) return;
    try {
      await api.delete(`/${id}`);
      fetchTasks();
    } catch (error) {}
  };

  const handleSaveTaskDetails = async (updatedTask) => {
    try {
      await api.put(`/${updatedTask.id}`, updatedTask);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {}
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const getTasksByDateString = (dayNum) => {
    const cellDate = new Date(currentYear, currentMonth, dayNum);
    return tasks.filter(task => {
      if (!task.startDate) return false;
      const taskDate = new Date(task.startDate);
      const normalizedTaskDate = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
      if (cellDate < normalizedTaskDate) return false;
      const freq = task.frecuencia || 'NUNCA';
      if (freq === 'NUNCA') return cellDate.getTime() === normalizedTaskDate.getTime();
      if (freq === 'DIARIA') return true;
      if (freq === 'SEMANAL') return taskDate.getDay() === cellDate.getDay();
      if (freq === 'MENSUAL') return taskDate.getDate() === cellDate.getDate();
      return false;
    });
  };

  return (
    <div className={`dashboard-wrapper ${showMobileCalendar ? 'show-calendar' : 'show-tasks'}`}>
      <header className="dashboard-header" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem',
        backgroundColor: '#2c3e50', color: 'white', height: '70px', flexShrink: 0
      }}>
        <h1 style={{ fontSize: '1.2rem' }}>Task Manager</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="user-greeting">Hola, <strong>{currentUser}</strong></span>
          <button onClick={onLogout} className="logout-btn" style={{
            padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px'
          }}>Salir</button>
        </div>
      </header>

      <main className="dashboard-main">
        <button className="mobile-toggle-btn" onClick={() => setShowMobileCalendar(!showMobileCalendar)}>
          {showMobileCalendar ? "Ver mis tareas" : "Ver calendario"}
        </button>

        <aside className="sidebar-aside">
          <h2 style={{ color: '#2c3e50', fontSize: '1.1rem', marginBottom: '15px' }}>Mis Tareas</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
            <input type="text" placeholder="¿Qué hay?" value={taskForm.title} onChange={(e) => setTaskForm({...taskForm, title: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <input type="datetime-local" value={taskForm.startDate} onChange={(e) => setTaskForm({...taskForm, startDate: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
            <select value={taskForm.frecuencia} onChange={(e) => setTaskForm({...taskForm, frecuencia: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
              <option value="NUNCA">No repetir</option>
              <option value="DIARIA">Diaria</option>
              <option value="SEMANAL">Semanal</option>
              <option value="MENSUAL">Mensual</option>
            </select>
            <button onClick={handleAddTask} style={{ backgroundColor: '#5d7147', color: 'white', padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold' }}>+ AÑADIR</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {tasks.map(task => <TaskItem key={task.id} task={task} onSelect={setSelectedTask} onDelete={handleDeleteTask} />)}
          </div>
        </aside>

        <section className="calendar-section">
          {viewMode === 'month' ? (
            <CalendarGrid currentDate={currentDate} setCurrentDate={setCurrentDate} monthNames={monthNames} getTasksByDateString={getTasksByDateString} onDayClick={(d) => { setSelectedDateView(new Date(currentYear, currentMonth, d)); setViewMode('day'); }} onTaskClick={setSelectedTask} />
          ) : (
            <DailyView date={selectedDateView} tasks={getTasksByDateString(selectedDateView.getDate())} onBack={() => setViewMode('month')} onTaskClick={setSelectedTask} />
          )}
        </section>
      </main>
      <Footer />
      <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} onSave={handleSaveTaskDetails} />
    </div>
  );
};

const TaskItem = ({ task, onSelect, onDelete }) => (
  <div style={{ padding: '12px', marginBottom: '8px', backgroundColor: '#FFFFFF', border: '1px solid #e0dfd8', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <div onClick={() => onSelect(task)} style={{ cursor: 'pointer', flex: 1 }}>
      <div style={{ fontWeight: '600', fontSize: '0.9rem', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</div>
      <div style={{ fontSize: '0.75rem', color: '#777' }}>{new Date(task.startDate).toLocaleDateString()}</div>
    </div>
    <button onClick={() => onDelete(task.id)} style={{ color: '#d9534f', background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>
  </div>
);

const CalendarGrid = ({ currentDate, setCurrentDate, monthNames, getTasksByDateString, onDayClick, onTaskClick }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const totalCells = Math.ceil((daysInMonth + startingDay) / 7) * 7;

  return (
    <div className="calendar-grid-container" style={{ flex: 1, backgroundColor: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #eae8e0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
        <h3 style={{ margin: 0 }}>{monthNames[month]} {year}</h3>
        <div>
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ padding: '5px 10px', marginRight: '5px' }}>{"<"}</button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} style={{ padding: '5px 10px' }}>{">"}</button>
        </div>
      </div>
      <div className="calendar-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#eee', flex: 1 }}>
        {Array.from({ length: totalCells }).map((_, i) => {
          const day = i - startingDay + 1;
          const isCurrent = day > 0 && day <= daysInMonth;
          const dayTasks = isCurrent ? getTasksByDateString(day) : [];
          return (
            <div key={i} onClick={() => isCurrent && onDayClick(day)} style={{ backgroundColor: isCurrent ? 'white' : '#fafafa', padding: '5px', minHeight: '60px', position: 'relative' }}>
              <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#aaa' }}>{isCurrent ? day : ''}</div>
              {dayTasks.slice(0, 3).map(t => (
                <div key={t.id} style={{ fontSize: '0.65rem', backgroundColor: '#eef3e6', padding: '2px', borderRadius: '3px', marginBottom: '1px', whiteSpace: 'nowrap', overflow: 'hidden' }}>{t.title}</div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;