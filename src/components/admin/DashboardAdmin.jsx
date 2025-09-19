import React, { useState } from 'react';
import LayoutAdmin from './LayoutAdmin.jsx';
import './dashboardAdmin.css';

const usuariosEjemplo = [
  { id: 1, nombre: 'Juan Perez', estado: 'Activo', email: 'juanperez@gmail.com', fecha: '20/01/2025', foto: '/src/assets/photo-1664871475935-39a9b861514f.jpeg' },
  { id: 2, nombre: 'Maria Gonzalez', estado: 'Activo', email: 'maria@gmail.com', fecha: '19/01/2025', foto: '/src/assets/premium_photo-1689530775582-83b8abdb5020.jpeg' },
  { id: 3, nombre: 'Alejandro Ruiz', estado: 'Inactivo', email: 'alejandro@gmail.com', fecha: '18/01/2025', foto: '/src/assets/premium_photo-1689551670902-19b441a6afde.jpeg' },
];

const ordenesEjemplo = [
  { id: '#1234', usuario: 'Alejandro Ruiz', fecha: '20/01/2025', total: 190.0, estado: 'Entregado' },
  { id: '#1235', usuario: 'Juan Perez', fecha: '20/01/2025', total: 250.0, estado: 'Entregado' },
  { id: '#1236', usuario: 'Maria Gonzalez', fecha: '20/01/2025', total: 90.0, estado: 'Entregado' },
];

function AdminDashboard() {
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(usuariosEjemplo[0]);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "/";
    return null;
  }
  return (
    <>
      <LayoutAdmin />
      <div className="admin-dashboard dashboard-container">
        <h1>📊 Panel de Administración</h1>

      
        <div className="metric-cards">
          <div className="metric-card">
            <h3>Órdenes</h3>
            <span>{ordenesEjemplo.length}</span>
          </div>
          <div className="metric-card">
            <h3>Usuarios nuevos</h3>
            <span>{usuariosEjemplo.length}</span>
          </div>
          <div className="metric-card">
            <h3>Ingresos totales</h3>
            <span>S/ {ordenesEjemplo.reduce((acc, o) => acc + o.total, 0).toFixed(2)}</span>
          </div>
        </div>

        
        <div className="panel-flex">
          
          <div className="panel-left table-card">
            <div className="tabla-header">
              <h2>Usuarios registrados</h2>
              <button className="btn" onClick={() => window.location.href = '/admin/ListaUsuario'}>👥 Ver todos los usuarios</button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosEjemplo.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td className={u.estado === 'Activo' ? 'activo' : 'inactivo'}>{u.estado}</td>
                    <td>
                      <button onClick={() => setUsuarioSeleccionado(u)} className="btn">
                        🔍 Ver detalle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button className="active">1</button>
              <button>2</button>
              <button>3</button>
            </div>
          </div>

          
          <div className="panel-right user-detail">
            <h2>Detalle del usuario</h2>
            {usuarioSeleccionado && (
              <>
                <img src={usuarioSeleccionado.foto} alt="Perfil" />
                <p><strong>Nombre:</strong> {usuarioSeleccionado.nombre}</p>
                <p><strong>gmail:</strong> {usuarioSeleccionado.email}</p>
                <p><strong>Fecha de registro:</strong> {usuarioSeleccionado.fecha}</p>
                <p><strong>Estado:</strong> {usuarioSeleccionado.estado}</p>
              </>
            )}
          </div>
        </div>

        
        <div className="table-card">
          <div className="tabla-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>Listado de órdenes</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn" onClick={() => window.location.href = '/admin/productos'}>
                📦 Ver productos
              </button>
              <button className="btn" onClick={() => window.location.href = '/admin/ordenes2'} >
                📋 Ver todas las órdenes
              </button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ordenesEjemplo.map((o, i) => (
                <tr key={i}>
                  <td className="id">{o.id}</td>
                  <td>{o.usuario}</td>
                  <td>{o.fecha}</td>
                  <td>S/ {o.total.toFixed(2)}</td>
                  <td>{o.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button className="active">1</button>
            <button>2</button>
            <button>3</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
