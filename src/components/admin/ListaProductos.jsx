import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutAdmin from './LayoutAdmin.jsx';
import EliminarProductoModal from './EliminarProductoModal.jsx';
import './listaProductos.css';

function ListaProductos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [productoEliminar, setProductoEliminar] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const almacenados = JSON.parse(localStorage.getItem('productos')) || [];
    setProductos(almacenados);
  }, []);

  const filtrar = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const editarProducto = (producto) => {
    localStorage.setItem('productoEditando', JSON.stringify(producto));
    navigate('/admin/productos/editar');
  };

  const eliminarProducto = () => {
    const nuevos = productos.filter(p => p.id !== productoEliminar.id);
    setProductos(nuevos);
    localStorage.setItem('productos', JSON.stringify(nuevos));
    setProductoEliminar(null);
  };

  return (
    <>
      <LayoutAdmin />
      <div className="listado-container">
        <div className="listado-header">
          <h1>📦 Listado de productos</h1>
          <button className="btn-agregar" onClick={() => navigate('/admin/productos/nuevo')}>
            ➕ Agregar producto
          </button>
        </div>

        <div className="listado-buscador">
          <input
            type="text"
            placeholder="Buscar un producto..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button>🔍 Buscar</button>
        </div>

        <table className="tabla-productos">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Id</th>
              <th>Nombre</th>
              <th>Presentación</th>
              <th>Descripción</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrar.length > 0 ? (
              filtrar.map((p, i) => (
                <tr key={i}>
                  <td><img src={p.imagen} alt={p.nombre} className="img-mini" /></td>
                  <td className="id">#{p.id}</td>
                  <td>{p.nombre}</td>
                  <td>{p.presentacion}</td>
                  <td>{p.descripcion.slice(0, 60)}...</td>
                  <td>{p.categoria}</td>
                  <td>{p.stock}</td>
                  <td>
                    <button className="accion editar" onClick={() => editarProducto(p)}>✏️</button>
                    <button className="accion eliminar" onClick={() => setProductoEliminar(p)}>🗑️</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">No hay productos disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {productoEliminar && (
        <EliminarProductoModal
          producto={productoEliminar}
          onConfirm={eliminarProducto}
          onCancel={() => setProductoEliminar(null)}
        />
      )}
    </>
  );
}

export default ListaProductos;
