import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ListaOrdenesUsuario.css';



function ListaOrdenesUsuario({ orders }) { 
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true); 


  useEffect(() => {
    if (orders) {
      setOrdenes(orders);
      setCargando(false);
    } else {
      setCargando(true); 
      setTimeout(() => setCargando(false), 500); 
    }
  }, [orders]);

  if (cargando) {
    return <div className="lista-ordenes-container loading-container">Cargando tus órdenes...</div>;
  }



  return (
    <div className="lista-ordenes-page">
      <div className="lista-ordenes-container">
        <div className="lista-ordenes-header">
          <h1 className="main-title">Mis Pedidos</h1>
          <Link to="/" className="button-secondary">← Volver a Inicio</Link>
        </div>

        {ordenes.length === 0 && ( 
          <p className="no-orders-message">Aún no tienes pedidos realizados.</p>
        )}

        {ordenes.length > 0 && (
          <div className="ordenes-list">
            {}
            {[...ordenes].sort((a, b) => new Date(b.fechaOriginal || b.id.split('-')[1]) - new Date(a.fechaOriginal || a.id.split('-')[1])).map(orden => (
              <div key={orden.id} className="orden-card">
                <div className="orden-card-header">
                  <h2 className="orden-id">Pedido #{orden.id}</h2>
                  <span className={`status-badge status-${orden.estado.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`}>{orden.estado}</span>
                </div>
                <div className="orden-card-body">
                  <p><strong>Fecha:</strong> {orden.fecha}</p>
                  <p><strong>Total:</strong> S/ {orden.resumenCosto.totalGeneral.toFixed(2)}</p>
                  {orden.items && orden.items.length > 0 && (
                    <p className="orden-items-preview">
                      <strong>Contiene:</strong> {orden.items.slice(0, 2).map(item => item.nombre).join(', ')}
                      {orden.items.length > 2 ? `, y ${orden.items.length - 2} más...` : ''}
                    </p>
                  )}
                </div>
                <div className="orden-card-footer">
                  <Link to={`/usuario/orden/detalle/${orden.id}`} className="button-primary view-details-button">
                    Ver Detalles del Pedido
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ListaOrdenesUsuario;
