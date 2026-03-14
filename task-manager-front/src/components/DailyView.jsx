import React from 'react';

const DailyView = ({ date, tasks, onBack, onTaskClick }) => {
  if (!date) return null;

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const titleDate = date.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#FFFFFF', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.03)', overflow: 'hidden', padding: '24px', border: '1px solid #eae8e0' }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', flexShrink: 0 }}>
        <button onClick={onBack} style={{ cursor: 'pointer', padding: '8px 16px', backgroundColor: '#f4f3ec', color: '#2c3e50', border: '1px solid #e0dfd8', borderRadius: '8px', fontWeight: '600', fontSize: '0.9rem' }}>
          &lt; Volver al Mes
        </button>
        <h2 style={{ margin: 0, color: '#2c3e50', textTransform: 'capitalize', fontSize: '1.4rem', fontWeight: '700' }}>{titleDate}</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '16px', minHeight: 0 }}>
        {hours.map(hour => {
          const tasksInThisHour = tasks.filter(task => {
            if (!task.startDate) return false;
            const taskDate = new Date(task.startDate);
            return taskDate.getHours() === hour;
          });

          const hourString = hour.toString().padStart(2, '0') + ':00';

          return (
            <div key={hour} style={{ display: 'flex', borderBottom: '1px solid #f4f3ec', minHeight: '90px', position: 'relative' }}>

              <div style={{ width: '65px', padding: '16px 10px 0 0', color: '#888', fontSize: '0.85rem', fontWeight: '600', textAlign: 'right', flexShrink: 0 }}>
                {hourString}
              </div>

              <div style={{ width: '1px', backgroundColor: '#eae8e0', margin: '0 16px' }}></div>

              <div style={{ flex: 1, padding: '10px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {tasksInThisHour.map(t => (
                  <div
                    key={t.id}
                    onClick={() => onTaskClick(t)}
                    style={{
                      backgroundColor: t.completed ? '#f9f8f5' : '#eef3e6',
                      borderLeft: `4px solid ${t.completed ? '#ccc' : '#5d7147'}`,
                      padding: '12px 16px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}
                  >
                    <span style={{ fontWeight: '600', color: t.completed ? '#999' : '#2c3e50', fontSize: '0.95rem', textDecoration: t.completed ? 'line-through' : 'none' }}>
                      {t.title}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#7a7a7a', fontWeight: '500' }}>
                      {new Date(t.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
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

export default DailyView;