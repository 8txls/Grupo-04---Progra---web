import React, { useState } from 'react';
import imgazucar from '../../assets/azucar.png';
import imgavena from '../../assets/avena.png';
import imgfrutas from '../../assets/frutas.png';
import imgcarnes from '../../assets/carnes.png';


import './ListaOrdenes2.css';

const ListaOrdenes2 = () => {
  const [filtro, setFiltro] = useState('');
  const [ordenes, setOrdenes] = useState([
  
  { id: 1, nombre: 'Carlos', apellido: 'Pérez', fecha: '20/01/2025', total: 120.0, cancelada: false },
  { id: 2, nombre: 'Lucía', apellido: 'García', fecha: '15/02/2025', total: 89.0, cancelada: false },
  { id: 3, nombre: 'Sebastián', apellido: 'López', fecha: '10/03/2025', total: 149.0, cancelada: false }
  ]);

  const [ordenDetalle, setOrdenDetalle] = useState(null);

  const productos = [
    { nombre: 'Frutas', imagen: imgfrutas },
    { nombre: 'Carnes', imagen: imgcarnes },
    { nombre: 'Avena', imagen: imgavena },
    { nombre: 'Azúcar', imagen: imgazucar },
  ];

  const ordenesFiltradas = ordenes.filter((orden) => {
    const termino = filtro.toLowerCase();
    return (
      orden.nombre.toLowerCase().includes(termino) ||
      orden.apellido.toLowerCase().includes(termino) ||
      orden.id.toString().includes(termino)
    );
  });

  const cancelarOrden = (id) => {
    setOrdenes((prev) =>
      prev.map((orden) =>
        orden.id === id ? { ...orden, cancelada: true } : orden
      )
    );
    setOrdenDetalle(null);
  };

  if (ordenDetalle) {
    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Detalle de la Orden</h2>
        <p><strong>ID:</strong> ORD-{ordenDetalle.id.toString().padStart(3, '0')}</p>
        <p><strong>Nombre:</strong> {ordenDetalle.nombre}</p>
        <p><strong>Apellido:</strong> {ordenDetalle.apellido}</p>
        <p><strong>Fecha:</strong> {ordenDetalle.fecha}</p>
        <p><strong>Total:</strong> S/ {ordenDetalle.total.toFixed(2)}</p>
        <p>
          <strong>Estado:</strong>{' '}
          <span className={ordenDetalle.cancelada ? 'estado-cancelado' : 'estado-activo'}>
            {ordenDetalle.cancelada ? 'Cancelada' : 'Activa'}
          </span>
        </p>

        <h3 className="mt-4 font-semibold">Productos solicitados:</h3>
        <ul className="modal-cart-list mt-2">
          {productos.map((producto, index) => (
            <li key={index} className="modal-cart-item">
              <img
                src={producto.imagen}
                alt={producto.nombre}
                className="modal-cart-img"
              />
              <span>{producto.nombre}</span>
            </li>
          ))}
        </ul>

        {!ordenDetalle.cancelada && (
          <button
            onClick={() => cancelarOrden(ordenDetalle.id)}
            className="mt-6 bg-red-600 text-white px-4 py-2 rounded"
          >
            Cancelar Orden
          </button>
        )}

        <button
          onClick={() => setOrdenDetalle(null)}
          className="mt-4 underline text-blue-600"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Listado de órdenes (ADMIN)</h2>

      <input
        type="text"
        placeholder="Buscar por nombre, apellido o ID"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        className="p-2 border rounded w-full mb-4"
      />

      <table className="tabla-ordenes w-full border-collapse">
        <thead>
          <tr>
            <th className="text-left border-b p-2">ID</th>
            <th className="text-left border-b p-2">Cliente</th>
            <th className="text-left border-b p-2">Fecha</th>
            <th className="text-left border-b p-2">Total (S/)</th>
            <th className="text-left border-b p-2">Estado</th>
            <th className="text-left border-b p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {ordenesFiltradas.map((orden) => (
            <tr key={orden.id} className={orden.cancelada ? 'bg-red-50' : ''}>
              <td className="p-2 font-mono">ORD-{orden.id.toString().padStart(3, '0')}</td>
              <td className="p-2">{orden.nombre} {orden.apellido}</td>
              <td className="p-2">{orden.fecha}</td>
              <td className="p-2">S/ {orden.total.toFixed(2)}</td>
              <td className="p-2">
                <span className={orden.cancelada ? 'estado-cancelado' : 'estado-activo'}>
                  {orden.cancelada ? 'Cancelada' : 'Activa'}
                </span>
              </td>
              <td className="p-2">
                <button
                  onClick={() => setOrdenDetalle(orden)}
                  className="text-blue-600 underline"
                >
                  Ver detalle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListaOrdenes2;
