import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import TaskDetailsModal from './TaskDetailsModal';
import DailyView from './DailyView';
import Footer from './Footer';
import { solicitarPermisosYGuardarToken } from '../services/notificationService';
import { getCurrentDateTime, getTasksByDate } from '../utils/dateUtils';

const isLocal = window.location.hostname === 'localhost';
const API_BASE_URL = isLocal
  ? 'http://localhost:8080/api/tasks'
  : 'https://task-manager-full-stack-production.up.railway.app/api/tasks';

const api = axios.create({ baseURL: API_BASE_URL });

const Dashboard = ({ currentUser, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [selectedDateView, setSelectedDateView] = useState(null);
  const [showMobileCalendar, setShowMobileCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [taskForm, setTaskForm] = useState({
    title: '',
    startDate: getCurrentDateTime(),
    frecuencia: 'NUNCA'
  });

  useEffect(() => {
    if (currentUser) solicitarPermisosYGuardarToken(currentUser);
  }, [currentUser]);

  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get(`/user/${currentUser}`);
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setTasks([]);
    }
  }, [currentUser]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleAddTask = async () => {
    if (!taskForm.title.trim()) return alert("Escribe un título");
    try {
      await api.post(`/${currentUser}`, { ...taskForm, description: "", completed: false });
      setTaskForm({ title: '', startDate: getCurrentDateTime(), frecuencia: 'NUNCA' });
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("¿Borrar tarea?")) return;
    try {
      await api.delete(`/${id}`);
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const handleSaveTaskDetails = async (updatedTask) => {
    try {
      await api.put(`/${updatedTask.id}`, updatedTask);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) { console.error(error); }
  };

  const currentTasksByDate = useMemo(() => {
    return (dayNum) => getTasksByDate(tasks, currentDate, dayNum);
  }, [tasks, currentDate]);

  return (
    <div className={`dashboard-wrapper ${showMobileCalendar ? 'show-calendar' : 'show-tasks'}`}>
      <DashboardHeader currentUser={currentUser} onLogout={onLogout} />

      <main className="dashboard-layout">
        <button className="mobile-toggle-btn" onClick={() => setShowMobileCalendar(!showMobileCalendar)}>
          {showMobileCalendar ? "Ver mis tareas" : "Ver calendario"}
        </button>

        <aside className="sidebar-aside">
          <div className="sidebar-card">
            <h2 className="sidebar-title">Añadir Nueva Tarea</h2>
            <TaskForm taskForm={taskForm} setTaskForm={setTaskForm} onAdd={handleAddTask} />
          </div>

          <div className="sidebar-card task-list-card">
            <h2 className="sidebar-title">Mis Tareas</h2>
            <div className="task-list-container">
              {tasks.length === 0 ? <p className="no-tasks">No hay tareas aún.</p> : null}
              {tasks.map(task => (
                <TaskItem key={task.id} task={task} onSelect={setSelectedTask} onDelete={handleDeleteTask} />
              ))}
            </div>
          </div>
        </aside>

        <section className="calendar-section">
          {viewMode === 'month' ? (
            <CalendarGrid
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              getTasksByDate={currentTasksByDate}
              onDayClick={(d) => {
                setSelectedDateView(new Date(currentDate.getFullYear(), currentDate.getMonth(), d));
                setViewMode('day');
              }}
              onTaskClick={setSelectedTask}
            />
          ) : (
            <DailyView
              date={selectedDateView}
              tasks={currentTasksByDate(selectedDateView.getDate())}
              onBack={() => setViewMode('month')}
              onTaskClick={setSelectedTask}
            />
          )}
        </section>
      </main>
      <Footer />
      {selectedTask && <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} onSave={handleSaveTaskDetails} />}
    </div>
  );
};

const DashboardHeader = ({ currentUser, onLogout }) => (
  <header className="app-header">
    <h1>Task Manager</h1>
    <div className="header-user-section">
      <span>Hola, <strong>{currentUser}</strong></span>
      <button onClick={onLogout} className="logout-btn">Cerrar sesión</button>
    </div>
  </header>
);

const TaskForm = ({ taskForm, setTaskForm, onAdd }) => (
  <div className="advanced-form">
    <input type="text" placeholder="Nombre de la tarea..." value={taskForm.title} onChange={(e) => setTaskForm({...taskForm, title: e.target.value})} />
    <input type="datetime-local" value={taskForm.startDate} onChange={(e) => setTaskForm({...taskForm, startDate: e.target.value})} />
    <select value={taskForm.frecuencia} onChange={(e) => setTaskForm({...taskForm, frecuencia: e.target.value})}>
      <option value="NUNCA">No repetir</option>
      <option value="DIARIA">Diaria</option>
      <option value="SEMANAL">Semanal</option>
      <option value="MENSUAL">Mensual</option>
    </select>
    <button onClick={onAdd} className="btn-add">Añadir Tarea</button>
  </div>
);

const TaskItem = ({ task, onSelect, onDelete }) => (
  <div className="task-card">
    <div onClick={() => onSelect(task)} className="task-info">
      <input type="checkbox" checked={task.completed} readOnly />
      <span className={`task-text ${task.completed ? 'completed' : ''}`}>{task.title}</span>
    </div>
    <button onClick={() => onDelete(task.id)} className="bin-btn">🗑️</button>
  </div>
);

const CalendarGrid = ({ currentDate, setCurrentDate, getTasksByDate, onDayClick, onTaskClick }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startingDay = new Date(year, month, 1).getDay();
  const totalCells = Math.ceil((daysInMonth + startingDay) / 7) * 7;

  return (
    <div className="calendar-grid-container">
      <div className="calendar-nav">
        <h2>Calendario - {monthNames[month]} {year}</h2>
        <div className="nav-buttons">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>{"<"}</button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>{">"}</button>
        </div>
      </div>

      {/* Cabecera de días de la semana */}
      <div className="calendar-days-header">
        {daysOfWeek.map(day => (
          <div key={day} className="day-name">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {Array.from({ length: totalCells }).map((_, i) => {
          const day = i - startingDay + 1;
          const isCurrent = day > 0 && day <= daysInMonth;
          const dayTasks = isCurrent ? getTasksByDate(day) : [];
          return (
            <div key={i} onClick={() => isCurrent && onDayClick(day)} className={`calendar-cell ${!isCurrent ? 'inactive' : ''}`}>
              <div className="cell-number">{isCurrent ? day : ''}</div>
              <div className="cell-tasks-wrapper">
                {dayTasks.slice(0, 3).map(t => (
                  <div key={t.id} onClick={(e) => { e.stopPropagation(); onTaskClick(t); }} className="cell-task-pill">
                    {t.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;