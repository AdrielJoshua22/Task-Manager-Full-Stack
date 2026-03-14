import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskDetailsModal from './TaskDetailsModal';
import DailyView from './DailyView';
import Footer from './Footer';

const Dashboard = ({ currentUser, onLogout }) => {
  const getCurrentDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(getCurrentDateTime());
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [viewMode, setViewMode] = useState('month');
  const [selectedDateView, setSelectedDateView] = useState(null);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/user/${currentUser}`);
      if (Array.isArray(response.data)) setTasks(response.data);
      else setTasks([]);
    } catch (error) { setTasks([]); }
  };

  useEffect(() => { fetchTasks(); }, [currentUser]);

  const handleLogout = () => {
    localStorage.removeItem('usuarioTaskApp');
    onLogout();
  };

  const handleAddTask = async () => {
    if (!title) return alert("Escribe un título");
    try {
      await axios.post(`http://localhost:8080/api/tasks/${currentUser}`, {
        title: title, description: "", startDate: startDate || null, completed: false
      });
      setTitle(''); setStartDate(getCurrentDateTime()); fetchTasks();
    } catch (error) { console.error(error); }
  };

  const handleDeleteTask = async (id) => {
    try { await axios.delete(`http://localhost:8080/api/tasks/${id}`); fetchTasks(); }
    catch (error) { console.error(error); }
  };

  const handleSaveTaskDetails = async (updatedTask) => {
    try {
      await axios.put(`http://localhost:8080/api/tasks/${updatedTask.id}`, updatedTask);
      setSelectedTask(null); fetchTasks();
    } catch (error) { console.error(error); }
  };

  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => {
    let day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startingDay = getFirstDayOfMonth(currentYear, currentMonth);
  const totalCells = Math.ceil((daysInMonth + startingDay) / 7) * 7;

  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));

  const getTasksByDateString = (dayNum) => {
    return tasks.filter(task => {
      if (!task.startDate) return false;
      const taskDate = new Date(task.startDate);
      return (
        taskDate.getFullYear() === currentYear &&
        taskDate.getMonth() === currentMonth &&
        taskDate.getDate() === dayNum
      );
    });
  };

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  const handleDayClick = (dayNum) => {
    const clickedDate = new Date(currentYear, currentMonth, dayNum);
    setSelectedDateView(clickedDate);
    setViewMode('day');
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", backgroundColor: '#f4f3ec', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '0 2rem', backgroundColor: '#2c3e50', color: 'white', height: '70px', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', zIndex: 10, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600', letterSpacing: '0.5px' }}>Task Manager</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <span style={{ fontSize: '0.95rem', color: '#e2e8f0' }}>Hola, <strong style={{ color: 'white', fontWeight: '600' }}>{currentUser}</strong></span>
          <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontWeight: '500', transition: 'all 0.2s' }}>Salir</button>
        </div>
      </header>

      <main style={{ display: 'flex', gap: '24px', padding: '24px', flex: 1, minHeight: 0, boxSizing: 'border-box', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>

        <aside style={{ width: '340px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', border: '1px solid #eae8e0' }}>
          <h2 style={{ color: '#2c3e50', fontSize: '1.2rem', margin: '0 0 20px 0', fontWeight: '700' }}>Mis Tareas</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <input type="text" placeholder="¿Qué necesitas hacer?" value={title} onChange={(e) => setTitle(e.target.value)} style={{ backgroundColor: '#f9f8f5', border: '1px solid #e0dfd8', borderRadius: '10px', padding: '12px 16px', outline: 'none', fontSize: '0.95rem', color: '#2c3e50', transition: 'border 0.2s' }} />
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} style={{ backgroundColor: '#f9f8f5', border: '1px solid #e0dfd8', borderRadius: '10px', padding: '12px 16px', outline: 'none', fontSize: '0.95rem', color: '#555' }} />
            <button onClick={handleAddTask} style={{ backgroundColor: '#5d7147', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontWeight: '600', cursor: 'pointer', marginTop: '4px', fontSize: '0.95rem', boxShadow: '0 4px 10px rgba(93, 113, 71, 0.25)', transition: 'transform 0.1s' }}>+ AÑADIR TAREA</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
            {tasks.length === 0 ? <p style={{color: '#999', textAlign: 'center', marginTop: '40px', fontSize: '0.9rem'}}>No hay tareas pendientes</p> :
              tasks.map(task => (
                <div key={task.id} style={{ padding: '16px', marginBottom: '8px', backgroundColor: task.completed ? '#f9f8f5' : '#FFFFFF', border: '1px solid #e0dfd8', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div onClick={() => setSelectedTask(task)} style={{ cursor: 'pointer', flex: 1 }}>
                    <span style={{ fontWeight: '600', fontSize: '0.95rem', textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#a0a09e' : '#2c3e50' }}>{task.title}</span>
                    <br /><small style={{ color: '#7a7a7a', fontSize: '0.8rem', marginTop: '4px', display: 'inline-block' }}>{task.startDate ? new Date(task.startDate).toLocaleDateString([], {day:'numeric', month:'short', hour:'2-digit', minute:'2-digit'}) : 'Sin fecha'}</small>
                  </div>
                  <button onClick={() => handleDeleteTask(task.id)} style={{ background: 'transparent', border: 'none', color: '#d9534f', cursor: 'pointer', width: '28px', height: '28px', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem' }}>×</button>
                </div>
              ))
            }
          </div>
        </aside>

        <section style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {viewMode === 'month' ? (
            <div style={{ flex: 1, backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #eae8e0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
                <h2 style={{ color: '#2c3e50', margin: 0, fontSize: '1.4rem', fontWeight: '700' }}>{monthNames[currentMonth]} {currentYear}</h2>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={prevMonth} style={{ cursor: 'pointer', padding: '8px 16px', backgroundColor: '#f4f3ec', color: '#2c3e50', border: '1px solid #e0dfd8', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem' }}>&lt; Anterior</button>
                  <button onClick={nextMonth} style={{ cursor: 'pointer', padding: '8px 16px', backgroundColor: '#f4f3ec', color: '#2c3e50', border: '1px solid #e0dfd8', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem' }}>Siguiente &gt;</button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#e0dfd8', gap: '1px', flex: 1, overflowY: 'auto', borderRadius: '12px', border: '1px solid #e0dfd8' }}>
                {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
                  <div key={day} style={{ padding: '12px', fontWeight: '600', fontSize: '0.85rem', color: '#555', textAlign: 'center', backgroundColor: '#f9f8f5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{day}</div>
                ))}

                {Array.from({ length: totalCells }).map((_, i) => {
                  const dayNum = i - startingDay + 1;
                  const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
                  const tasksOnDay = isCurrentMonth ? getTasksByDateString(dayNum) : [];

                  return (
                    <div
                      key={i}
                      onClick={() => isCurrentMonth && handleDayClick(dayNum)}
                      style={{ minHeight: '110px', padding: '8px', backgroundColor: isCurrentMonth ? '#FFFFFF' : '#f9f8f5', cursor: isCurrentMonth ? 'pointer' : 'default', display: 'flex', flexDirection: 'column' }}
                    >
                      <div style={{ textAlign: 'right', color: isCurrentMonth ? '#2c3e50' : 'transparent', marginBottom: '8px', fontSize: '0.9rem', fontWeight: '600', paddingRight: '4px' }}>
                        {isCurrentMonth ? dayNum : "."}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {tasksOnDay.map(t => (
                          <div key={t.id} onClick={(e) => { e.stopPropagation(); setSelectedTask(t); }} style={{
                            fontSize: '0.75rem', fontWeight: '500', backgroundColor: t.completed ? '#f0f0f0' : '#eef3e6', padding: '6px 8px', borderRadius: '6px', color: t.completed ? '#999' : '#2c3e50', textDecoration: t.completed ? 'line-through' : 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', borderLeft: `3px solid ${t.completed ? '#ccc' : '#5d7147'}`
                          }}>
                            {t.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            selectedDateView && (
              <DailyView date={selectedDateView} tasks={getTasksByDateString(selectedDateView.getDate())} onBack={() => setViewMode('month')} onTaskClick={setSelectedTask} />
            )
          )}
        </section>
      </main>

      <Footer />

      <TaskDetailsModal task={selectedTask} onClose={() => setSelectedTask(null)} onSave={handleSaveTaskDetails} />
    </div>
  );
};

export default Dashboard;