import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = ({ currentUser, onLogout }) => {
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(getCurrentDateTime());
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/user/${currentUser}`);
      if (Array.isArray(response.data)) {
        setTasks(response.data);
      } else {
        setTasks([]);
      }
    } catch (error) {
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('usuarioTaskApp');
    onLogout();
  };

  const handleAddTask = async () => {
    if (!title) return alert("Escribe un título");
    try {
      await axios.post(`http://localhost:8080/api/tasks/${currentUser}`, {
        title: title,
        startDate: startDate || null,
        completed: false
      });
      setTitle('');
      setStartDate(getCurrentDateTime());
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await axios.put(`http://localhost:8080/api/tasks/${task.id}`, {
        ...task,
        completed: !task.completed
      });
      fetchTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const getTasksByDay = (day) => {
    return tasks.filter(task => {
      if (!task.startDate) return false;
      const date = new Date(task.startDate);
      return date.getUTCDate() === day;
    });
  };

  return (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f4f3ec', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', backgroundColor: '#2c3e50', color: 'white' }}>
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>Task Manager</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Hola, <strong>{currentUser}</strong></span>
          <button onClick={handleLogout} style={{ padding: '0.4rem 0.8rem', cursor: 'pointer', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }}>Salir</button>
        </div>
      </header>

      <main style={{ display: 'flex', gap: '20px', padding: '20px', flex: 1 }}>
        <aside style={{ width: '320px', backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ color: '#333', fontSize: '1.4rem', margin: 0 }}>✓= Mis Tareas</h2>
          <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
            <input type="text" placeholder="¿Qué hay que hacer?" value={title} onChange={(e) => setTitle(e.target.value)} style={{ border: 'none', borderBottom: '1px solid #ccc', padding: '10px 5px', outline: 'none' }} />
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ border: 'none', borderBottom: '1px solid #ccc', padding: '10px 5px', outline: 'none' }} />
            <button onClick={handleAddTask} style={{ backgroundColor: '#5d7147', color: 'white', border: 'none', borderRadius: '6px', padding: '12px', fontWeight: 'bold', cursor: 'pointer' }}>+ AÑADIR TAREA</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {tasks.length === 0 ? <p style={{color: '#999', textAlign: 'center'}}>No hay tareas aún</p> :
              tasks.map(task => (
                <div key={task.id} style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div onClick={() => handleToggleComplete(task)} style={{ cursor: 'pointer', flex: 1 }}>
                    <span style={{ fontWeight: '500', textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#aaa' : '#333' }}>{task.title}</span>
                    <br />
                    <small style={{ color: '#888' }}>{task.startDate ? new Date(task.startDate).toLocaleDateString() : 'Sin fecha'}</small>
                  </div>
                  <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
                </div>
              ))
            }
          </div>
        </aside>

        <section style={{ flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '20px' }}>Marzo de 2026</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderTop: '1px solid #eee', borderLeft: '1px solid #eee' }}>
            {['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'].map(day => (
              <div key={day} style={{ padding: '10px', fontWeight: 'bold', textAlign: 'center', borderRight: '1px solid #eee', borderBottom: '1px solid #eee', backgroundColor: '#fafafa' }}>{day}</div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => {
              const dayNum = i - 4;
              const isCurrentMonth = dayNum > 0 && dayNum <= 31;
              const tasksOnDay = isCurrentMonth ? getTasksByDay(dayNum) : [];

              return (
                <div key={i} style={{ minHeight: '100px', borderRight: '1px solid #eee', borderBottom: '1px solid #eee', padding: '5px' }}>
                  <div style={{ textAlign: 'right', color: isCurrentMonth ? '#333' : '#ccc', marginBottom: '5px', fontSize: '0.9rem' }}>{isCurrentMonth ? dayNum : ""}</div>
                  {tasksOnDay.map(t => (
                    <div key={t.id} style={{
                      fontSize: '0.65rem',
                      backgroundColor: t.completed ? '#e8f5e9' : '#f0f4c3',
                      padding: '2px 4px',
                      marginBottom: '2px',
                      borderRadius: '3px',
                      borderLeft: `3px solid ${t.completed ? '#4caf50' : '#8bc34a'}`,
                      textDecoration: t.completed ? 'line-through' : 'none',
                      color: '#333',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {t.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;