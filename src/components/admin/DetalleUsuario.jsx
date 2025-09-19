import React from "react";
import { useParams } from "react-router-dom";
import './DetalleUsuario.css';

const usuarios = [
  {
    id: 'USR-001',
    nombre: "Carlos Pérez",
    correo: "carlos@example.com",
    fechaRegistro: "01/01/2025",
    estado: "Activo",
    foto: "/src/assets/photo-1664871475935-39a9b861514f.jpeg",
    ordenes: [
  { id: "1001", fecha: "20/01/2025", total: 120.0 },
  { id: "1002", fecha: "25/01/2025", total: 199.0 },
  { id: "1003", fecha: "05/02/2025", total: 87.5 },
  { id: "1004", fecha: "10/02/2025", total: 134.0 },
  { id: "1005", fecha: "15/02/2025", total: 210.0 },
  { id: "1006", fecha: "20/02/2025", total: 99.9 },
  { id: "1007", fecha: "25/02/2025", total: 160.0 },
  { id: "1008", fecha: "01/03/2025", total: 185.5 },
  { id: "1009", fecha: "05/03/2025", total: 143.0 },
  { id: "1010", fecha: "10/03/2025", total: 175.0 }
]

  },
  {
    id: 'USR-002',
    nombre: "Lucía García",
    correo: "lucia@example.com",
    fechaRegistro: "02/01/2025",
    estado: "Activo",
    foto: "/src/assets/premium_photo-1689530775582-83b8abdb5020.jpeg",
    ordenes: [
  { id: "2001", fecha: "15/02/2025", total: 89.0 },
  { id: "2002", fecha: "18/02/2025", total: 112.0 },
  { id: "2003", fecha: "22/02/2025", total: 145.0 },
  { id: "2004", fecha: "25/02/2025", total: 70.0 },
  { id: "2005", fecha: "01/03/2025", total: 130.0 },
  { id: "2006", fecha: "05/03/2025", total: 95.5 },
  { id: "2007", fecha: "10/03/2025", total: 155.0 },
  { id: "2008", fecha: "15/03/2025", total: 180.0 },
  { id: "2009", fecha: "18/03/2025", total: 78.0 },
  { id: "2010", fecha: "22/03/2025", total: 168.0 }
]

  },
  {
    id: 'USR-003',
    nombre: "Sebastián López",
    correo: "sebastian@example.com",
    fechaRegistro: "03/01/2025",
    estado: "Activo",
    foto: "/src/assets/premium_photo-1689551670902-19b441a6afde.jpeg",
    ordenes: [
  { id: "3001", fecha: "10/03/2025", total: 149.0 },
  { id: "3002", fecha: "18/03/2025", total: 75.0 },
  { id: "3003", fecha: "22/03/2025", total: 132.0 },
  { id: "3004", fecha: "26/03/2025", total: 110.0 },
  { id: "3005", fecha: "30/03/2025", total: 195.0 },
  { id: "3006", fecha: "02/04/2025", total: 98.0 },
  { id: "3007", fecha: "05/04/2025", total: 142.5 },
  { id: "3008", fecha: "08/04/2025", total: 156.0 },
  { id: "3009", fecha: "12/04/2025", total: 170.0 },
  { id: "3010", fecha: "15/04/2025", total: 190.0 }
]

  },
];

const DetalleUsuario = () => {
  const { id } = useParams();
  const usuario = usuarios.find(u => u.id === id);

  if (!usuario) return <p>Usuario no encontrado</p>;

  return (
    <div className="dashboard-container">
      <h2>Detalles de usuario</h2>
      <div className="user-detail">
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
          <div>
            <h2>{usuario.nombre}</h2>
            <p><strong>Correo:</strong> <a href={`mailto:${usuario.correo}`}>{usuario.correo}</a></p>
            <p><strong>Fecha de registro:</strong> {usuario.fechaRegistro}</p>
            <p><strong>Estado:</strong> {usuario.estado}</p>
          </div>
          <img src={usuario.foto} alt="Usuario" className="foto-usuario" />
        </div>

        <h2 style={{ marginTop: "2rem" }}>Últimas órdenes</h2>
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>#ID</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuario.ordenes.slice(0, 10).map((orden, idx) => (
                <tr key={idx}>
                  <td><a href={`/orden/${orden.id}`} style={{ color: "#d63636", textDecoration: "underline" }}>#{orden.id}</a></td>
                  <td>{orden.fecha}</td>
                  <td>S/{orden.total.toFixed(2)}</td>
                  <td><button className="btn-tabla">Ver detalle</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetalleUsuario;
