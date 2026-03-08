import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import esLocale from '@fullcalendar/core/locales/es';
import { Trash2, Plus, ListChecks, X, Sun, Moon } from 'lucide-react'; // Sumamos Sun y Moon

const API_URL = "http://localhost:8080/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState("2026-03-08T09:00");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [note, setNote] = useState('');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      const mapped = res.data.map(t => ({
        id: String(t.id),
        title: t.title,
        start: t.startDate,
        backgroundColor: 'var(--accent)',
        borderColor: 'transparent',
        extendedProps: { ...t }
      }));
      setTasks(mapped);
    } catch (e) { console.error("Error cargando tareas", e); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await axios.post(API_URL, { title, startDate, completed: false, description: "" });
      setTitle('');
      fetchTasks();
    } catch (e) { console.error("Error al añadir", e); }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (e) { console.error("Error al borrar", e); }
  };

  const openModal = (task) => {
    setSelectedTask(task.extendedProps);
    setNote(task.extendedProps.description || "");
    setIsModalOpen(true);
  };

  const saveNote = async () => {
    try {
      await axios.put(`${API_URL}/${selectedTask.id}`, { ...selectedTask, description: note });
      setIsModalOpen(false);
      fetchTasks();
    } catch (e) { console.error("Error al guardar", e); }
  };

  return (
    <>
      <button
        className="theme-toggle"
        onClick={() => setIsDarkMode(!isDarkMode)}
        title="Cambiar tema"
      >
        {isDarkMode ? <Sun size={24} color="#fafafa" /> : <Moon size={24} color="#2c3327" />}
      </button>

      <div className="dashboard-container">
        <div className="dashboard-grid">
          <aside className="main-card">
            <header className="app-header">
              <ListChecks className="header-icon" size={28} />
              <h1>Mis Tareas</h1>
            </header>

            <form onSubmit={addTask} className="advanced-form">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="¿Qué hay que hacer?" />
              <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <button type="submit" className="add-btn-large"><Plus size={18}/> Añadir Tarea</button>
            </form>

            <div className="task-container">
              {tasks.map(t => (
                <div key={t.id} className="task-card" onDoubleClick={() => openModal(t)}>
                  <div className="task-info">
                    <span className="task-text">{t.title}</span>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteTask(t.id); }} className="bin-btn">
                    <Trash2 size={18}/>
                  </button>
                </div>
              ))}
            </div>
          </aside>

          <main className="calendar-card-modern">
            <FullCalendar
              key={tasks.length}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              locale={esLocale}
              events={tasks}
              height="100%"
              headerToolbar={{ left: 'prev,next today', center: 'title', right: '' }}
            />
          </main>
        </div>

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <header className="modal-header">
                <h3>Notas: {selectedTask?.title}</h3>
                <button className="bin-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
              </header>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Escribe los detalles..." autoFocus />
              <button className="add-btn-large" style={{ width: '100%' }} onClick={saveNote}>Guardar Nota</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;