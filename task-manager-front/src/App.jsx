import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, CheckCircle, Circle, Plus, ListChecks } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const API_URL = "http://localhost:8080/api/tasks";

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL);
      setTasks(res.data);
    } catch (e) { console.error("Error", e); }
  };

  useEffect(() => { fetchTasks(); }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await axios.post(API_URL, { title, description: "", completed: false });
    setTitle('');
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await axios.put(`${API_URL}/${task.id}`, { ...task, completed: !task.completed });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  return (
      <div className="app-container">
        <div className="main-card">
          <header className="app-header">
            <ListChecks size={28} color="#6366f1" />
            <h1>Mis Tareas</h1>
          </header>

          <form onSubmit={addTask} className="input-box">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Añadir nueva tarea..."
              autoFocus
            />
            <button type="submit" className="add-btn">
              <Plus size={20} />
            </button>
          </form>

          <div className="task-container">
            {tasks.length === 0 ? (
              <p className="empty-text">No hay tareas pendientes</p>
            ) : (
              tasks.map(task => (
                <div
                  key={task.id}
                  /* Agregamos una clase dinámica para el CSS */
                  className={`task-card ${task.completed ? 'completed' : ''}`}
                  style={{ opacity: task.completed ? 0.7 : 1, transition: '0.3s' }}
                >
                  <div className="task-info" onClick={() => toggleComplete(task)}>
                    {task.completed ?
                      <CheckCircle className="check-icon active" color="#10b981" /> :
                      <Circle className="check-icon" color="#6366f1" />
                    }
                    {/* Aquí aplicamos el tachado visual */}
                    <span className="task-text" style={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? '#94a3b8' : '#f8fafc'
                    }}>
                      {task.title}
                    </span>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="bin-btn">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {tasks.length > 0 && (
            <footer className="stats">
              <strong>{tasks.filter(t => t.completed).length}</strong> de {tasks.length} completadas
            </footer>
          )}
        </div>
      </div>
    );
}
export default App;