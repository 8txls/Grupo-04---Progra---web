import React from 'react';
import './modalEliminar.css';

function EliminarProductoModal({ producto, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-eliminar">
        <h2>❌ Eliminar producto</h2>
        <p>¿Estás seguro que deseas eliminar el producto <strong>“{producto.nombre}”</strong>?</p>
        <div className="botones">
          <button className="btn-si" onClick={onConfirm}>Sí, eliminar</button>
          <button className="btn-no" onClick={onCancel}>No, cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default EliminarProductoModal;
