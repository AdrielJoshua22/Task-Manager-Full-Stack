import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: username,
        password: password
      });
      setCurrentUser(response.data.username);
      setError('');
    } catch (err) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  if (!currentUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f4f4f9' }}>
        <form onSubmit={handleLogin} style={{ padding: '2rem', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
          <h2 style={{ textAlign: 'center', margin: 0 }}>Iniciar Sesión</h2>
          {error && <p style={{ color: 'red', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}
          <input
            type="text"
            placeholder="Usuario (ej. luffy_dev)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
          <button type="submit" style={{ padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem 2rem', backgroundColor: '#333', color: 'white' }}>
        <h1 style={{ margin: 0 }}>Task Manager</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span>Hola, <strong>{currentUser}</strong></span>
          <button
            onClick={() => setCurrentUser(null)}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Salir
          </button>
        </div>
      </header>

      <main style={{ padding: '2rem' }}>
        <h2>Bienvenido a tu panel de control</h2>
        <p>Tu sesión se ha iniciado correctamente.</p>

        <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px dashed #ccc', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>Aquí construiremos tu formulario para crear tareas y la lista para verlas.</p>
        </div>
      </main>
    </div>
  );
}

export default App;