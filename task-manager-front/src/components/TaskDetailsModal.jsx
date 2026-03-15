import React, { useState, useEffect } from 'react';

const TaskDetailsModal = ({ task, onClose, onSave }) => {
  const [editDescription, setEditDescription] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [editStartDate, setEditStartDate] = useState('');
  const [editFrecuencia, setEditFrecuencia] = useState('NUNCA');

  useEffect(() => {
    if (task) {
      setEditDescription(task.description || '');
      setIsCompleted(task.completed || false);
      setEditStartDate(task.startDate ? task.startDate.slice(0, 16) : '');
      setEditFrecuencia(task.frecuencia || 'NUNCA');
    }
  }, [task]);

  const handleSave = () => {
    onSave({
      ...task,
      description: editDescription,
      completed: isCompleted,
      startDate: editStartDate || null,
      frecuencia: editFrecuencia
    });
  };

  if (!task) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(44, 62, 80, 0.6)', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: '#FFFFFF', padding: '32px', borderRadius: '20px', width: '450px', maxWidth: '90%', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', display: 'flex', flexDirection: 'column', gap: '24px', border: '1px solid #eae8e0' }}>

        <div style={{ borderBottom: '1px solid #f4f3ec', paddingBottom: '16px' }}>
          <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '1.4rem', fontWeight: '700' }}>
            {task.title}
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>Fecha y Hora:</label>
          <input
            type="datetime-local"
            value={editStartDate}
            onChange={(e) => setEditStartDate(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e0dfd8', backgroundColor: '#f9f8f5', outline: 'none', fontSize: '0.95rem', color: '#555', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>Repetir Tarea:</label>
          <select
            value={editFrecuencia}
            onChange={(e) => setEditFrecuencia(e.target.value)}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e0dfd8', backgroundColor: '#f9f8f5', outline: 'none', fontSize: '0.95rem', color: '#555', boxSizing: 'border-box', fontFamily: 'inherit', cursor: 'pointer' }}
          >
            <option value="NUNCA">No repetir (Una sola vez)</option>
            <option value="DIARIA">Repetir diariamente</option>
            <option value="SEMANAL">Repetir semanalmente</option>
            <option value="MENSUAL">Repetir mensualmente</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontWeight: '600', color: '#555', fontSize: '0.9rem' }}>Observaciones / Descripción:</label>
          <textarea
            placeholder="Añade detalles, notas o subtareas aquí..."
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            style={{ width: '100%', height: '110px', padding: '16px', borderRadius: '12px', border: '1px solid #e0dfd8', backgroundColor: '#f9f8f5', resize: 'vertical', fontFamily: 'inherit', outline: 'none', fontSize: '0.95rem', color: '#2c3e50', boxSizing: 'border-box' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', backgroundColor: isCompleted ? '#eef3e6' : '#f9f8f5', borderRadius: '12px', border: `1px solid ${isCompleted ? '#d3dfc2' : '#e0dfd8'}`, transition: 'all 0.2s' }}>
          <input
            type="checkbox"
            id="modalComplete"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: '#5d7147' }}
          />
          <label htmlFor="modalComplete" style={{ cursor: 'pointer', fontWeight: '600', color: isCompleted ? '#4a5a38' : '#555', fontSize: '0.95rem', userSelect: 'none' }}>
            {isCompleted ? '✓ Tarea Completada' : 'Marcar como completada'}
          </label>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
          <button onClick={onClose} style={{ padding: '12px 20px', backgroundColor: '#f4f3ec', color: '#555', border: '1px solid #e0dfd8', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem' }}>
            Cancelar
          </button>
          <button onClick={handleSave} style={{ padding: '12px 20px', backgroundColor: '#5d7147', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', boxShadow: '0 4px 10px rgba(93, 113, 71, 0.25)' }}>
            Guardar Cambios
          </button>
        </div>

      </div>
    </div>
  );
};

export default TaskDetailsModal;