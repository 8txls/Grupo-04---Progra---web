import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Puedes usar los mismos estilos que Login

function Recuperar() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() === '') {
      setStatus('Por favor ingresa un correo válido');
      return;
    }

    // Simula el envío de instrucciones por email
    setStatus(`Se han enviado instrucciones a ${email}`);
    setEmail('');
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Recuperar Contraseña</h2>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="usuario@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            Enviar link de recuperacion
          </button>
        </form>

        {status && (
          <p style={{ marginTop: '10px', color: 'green', textAlign: 'center' }}>
            {status}
          </p>
        )}

        <button
          onClick={() => navigate('/login')}
          style={{
            marginTop: '20px',
            backgroundColor: '#ddd',
            padding: '10px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          ⬅ Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default Recuperar;
