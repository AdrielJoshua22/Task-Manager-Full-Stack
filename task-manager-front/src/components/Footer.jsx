import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '12px 20px',
      backgroundColor: '#f4f3ec',
      borderTop: '1px solid #eae8e0',
      color: '#7a7a7a',
      fontSize: '0.85rem',
      flexShrink: 0,
      position: 'relative',
      zIndex: 10
    }}>
      <span>Desarrollado por <strong style={{ color: '#2c3e50' }}>AdrielJoshua</strong></span>

      <span style={{ margin: '0 12px', color: '#d0cfc8' }}>|</span>

      <a
        href="https://github.com/adrieljoshua22"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#5d7147', textDecoration: 'none', fontWeight: '600', transition: 'opacity 0.2s' }}
        onMouseOver={(e) => e.target.style.opacity = '0.7'}
        onMouseOut={(e) => e.target.style.opacity = '1'}
      >
        GitHub: adrieljoshua22
      </a>

      <span style={{ margin: '0 12px', color: '#d0cfc8' }}>|</span>

      <a
        href="https://instagram.com/jjosh.ua"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#5d7147', textDecoration: 'none', fontWeight: '600', transition: 'opacity 0.2s' }}
        onMouseOver={(e) => e.target.style.opacity = '0.7'}
        onMouseOut={(e) => e.target.style.opacity = '1'}
      >
        IG: @jjosh.ua
      </a>
    </footer>
  );
};

export default Footer;