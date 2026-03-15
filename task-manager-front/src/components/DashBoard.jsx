import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TaskDetailsModal from './TaskDetailsModal';
import DailyView from './DailyView';
import Footer from './Footer';

// 1. Configuración de instancia de Axios para no repetir la URL
const api = axios.create({
  baseURL: 'https://task-manager-full-stack-production.up.railway.app/api/tasks'
});

const Dashboard = ({ currentUser, onLogout }) => {
  // --- Estados ---
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

  // --- Helpers ---
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Inicializar fecha del formulario
  useEffect(() => {
    setTaskForm(prev => ({ ...prev, startDate: getCurrentDateTime() }));
  }, []);

  // --- Operaciones API ---
  const fetchTasks = useCallback(async () => {
    try {
      const { data } = await api.get(`/user/${currentUser}`);
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando tareas:", error);
      setTasks([]);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async () => {
    if (!taskForm.title.trim()) return alert("Escribe un título");

    try {
      await api.post(`/${currentUser}`, {
        ...taskForm,
        description: "",
        completed: false
      });
      setTaskForm({ title: '', startDate: getCurrentDateTime(), frecuencia: 'NUNCA' });
      fetchTasks();
    } catch (error) {
      console.error("Error al añadir:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("¿Seguro que quieres borrar esta tarea?")) return;
    try {
      await api.delete(`/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error al borrar:", error);
    }
  };

  const handleSaveTaskDetails = async (updatedTask) => {
    try {
      await api.put(`/${updatedTask.id}`, updatedTask);
      setSelectedTask(null);
      fetchTasks();
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  // --- Lógica de Calendario ---
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

  // --- Renderizado de UI ---
  return (
    <div className="dashboard-wrapper" style={{
      fontFamily: "'Inter', sans-serif", backgroundColor: '#f4f3ec',
      position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>

      {/* Header */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 2rem',
        backgroundColor: '#2c3e50', color: 'white', height: '70px', flexShrink: 0
      }}>
        <h1 style={{ fontSize: '1.3rem', fontWeight: '600' }}>Task Manager</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span>Hola, <strong>{currentUser}</strong></span>
          <button onClick={onLogout} style={{
            padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px'
          }}>Salir</button>
        </div>
      </header>

      <main style={{ display: 'flex', gap: '24px', padding: '24px', flex: 1, overflow: 'hidden', maxWidth: '1600px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>

        {/* Sidebar: Formulario y Lista */}
        <aside style={{
          width: '340px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px',
          display: 'flex', flexDirection: 'column', border: '1px solid #eae8e0', overflow: 'hidden'
        }}>
          <h2 style={{ color: '#2c3e50', fontSize: '1.2rem', marginBottom: '20px' }}>Mis Tareas</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <input
              type="text" placeholder="¿Qué hay que hacer?"
              value={taskForm.title}
              onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e0dfd8' }}
            />
            <input
              type="datetime-local"
              value={taskForm.startDate}
              onChange={(e) => setTaskForm({...taskForm, startDate: e.target.value})}
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e0dfd8' }}
            />
            <select
              value={taskForm.frecuencia}
              onChange={(e) => setTaskForm({...taskForm, frecuencia: e.target.value})}
              style={{ padding: '12px', borderRadius: '10px', border: '1px solid #e0dfd8' }}
            >
              <option value="NUNCA">No repetir</option>
              <option value="DIARIA">Diaria</option>
              <option value="SEMANAL">Semanal</option>
              <option value="MENSUAL">Mensual</option>
            </select>
            <button onClick={handleAddTask} style={{
              backgroundColor: '#5d7147', color: 'white', padding: '14px',
              borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer'
            }}>+ AÑADIR TAREA</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {tasks.map(task => (
              <TaskItem key={task.id} task={task} onSelect={setSelectedTask} onDelete={handleDeleteTask} />
            ))}
          </div>
        </aside>

        {/* Calendario */}
        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {viewMode === 'month' ? (
            <CalendarGrid
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              monthNames={monthNames}
              getTasksByDateString={getTasksByDateString}
              onDayClick={(d) => { setSelectedDateView(new Date(currentYear, currentMonth, d)); setViewMode('day'); }}
              onTaskClick={setSelectedTask}
            />
          ) : (
            <DailyView
              date={selectedDateView}
              tasks={getTasksByDateString(selectedDateView.getDate())}
              onBack={() => setViewMode('month')}
              onTaskClick={setSelectedTask}
            />
          )}
        </section>
      </main>

      <Footer />
      <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} onSave={handleSaveTaskDetails} />
    </div>
  );
};

// --- Sub-componentes para mayor orden ---

const TaskItem = ({ task, onSelect, onDelete }) => (
  <div style={{
    padding: '16px', marginBottom: '8px', backgroundColor: task.completed ? '#f9f8f5' : '#FFFFFF',
    border: '1px solid #e0dfd8', borderRadius: '12px', display: 'flex', justifyContent: 'space-between'
  }}>
    <div onClick={() => onSelect(task)} style={{ cursor: 'pointer', flex: 1 }}>
      <span style={{ fontWeight: '600', textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</span>
      <div style={{ fontSize: '0.8rem', color: '#7a7a7a' }}>
        {new Date(task.startDate).toLocaleDateString()} {task.frecuencia !== 'NUNCA' && `↻ ${task.frecuencia}`}
      </div>
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
    <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', border: '1px solid #eae8e0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontWeight: '700' }}>{monthNames[month]} {year}</h2>
        <div>
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} style={{ marginRight: '8px' }}>Ant.</button>
          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>Sig.</button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: '#e0dfd8', flex: 1, borderRadius: '12px', overflow: 'hidden' }}>
        {Array.from({ length: totalCells }).map((_, i) => {
          const day = i - startingDay + 1;
          const isCurrent = day > 0 && day <= daysInMonth;
          const dayTasks = isCurrent ? getTasksByDateString(day) : [];
          return (
            <div key={i} onClick={() => isCurrent && onDayClick(day)} style={{ backgroundColor: isCurrent ? 'white' : '#f9f8f5', padding: '8px', minHeight: '80px' }}>
              <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '0.8rem' }}>{isCurrent ? day : ''}</div>
              {dayTasks.map(t => (
                <div key={t.id} onClick={(e) => { e.stopPropagation(); onTaskClick(t); }} style={{ fontSize: '0.7rem', backgroundColor: '#eef3e6', marginBottom: '2px', padding: '2px 4px', borderRadius: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {t.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;