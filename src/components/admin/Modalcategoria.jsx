import React, { useState } from 'react';
import './modalCategoria.css';

function ModalCategoria({ onClose, onSave }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const handleGuardar = () => {
    if (nombre.trim() === '') return alert('Nombre requerido');
    onSave({ nombre, descripcion });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2 className="modal-title">Nueva categoría</h2>

        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          onChange={e => setNombre(e.target.value)}
        />

        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
        />

        <div className="modal-actions">
          <button className="crear" onClick={handleGuardar}>✔ Crear categoría</button>
          <button className="cancelar" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ModalCategoria;
