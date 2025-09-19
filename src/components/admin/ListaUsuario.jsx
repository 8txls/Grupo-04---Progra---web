import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ListaUsuarios.css';

const usuariosIniciales = [
  { id: 'USR-001', nombre: 'Carlos', apellido: 'Pérez', email: 'carlos@example.com', activo: true },
  { id: 'USR-002', nombre: 'Lucía', apellido: 'García', email: 'lucia@example.com', activo: true },
  { id: 'USR-003', nombre: 'Sebastián', apellido: 'López', email: 'sebastian@example.com', activo: true },
];

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState(usuariosIniciales);
  const [filtro, setFiltro] = useState('');

  const desactivarUsuario = (id) => {
    const nuevosUsuarios = usuarios.map(u =>
      u.id === id ? { ...u, activo: false } : u
    );
    setUsuarios(nuevosUsuarios);
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.id.toLowerCase().includes(filtro.toLowerCase()) ||
    u.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    u.apellido.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="table-card">
        <h2>Lista de Usuarios</h2>
        <input
          type="text"
          placeholder="Buscar por ID, nombre o apellido"
          value={filtro}
          onChange={e => setFiltro(e.target.value)}
          style={{ marginBottom: '1rem', padding: '8px', width: '100%' }}
        />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map(usuario => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre} {usuario.apellido}</td>
                <td>{usuario.email}</td>
                <td className={usuario.activo ? 'activo' : 'inactivo'}>
                  {usuario.activo ? 'Activo' : 'Inactivo'}
                </td>
                <td>
                  <button
                    className="btn-tabla"
                    onClick={() => desactivarUsuario(usuario.id)}
                    disabled={!usuario.activo}
                  >
                    Desactivar
                  </button>
                  <Link to={`/admin/usuarios/${usuario.id}`} className="btn-tabla" style={{ marginLeft: '10px' }}>
                    Ver Detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListaUsuarios;
