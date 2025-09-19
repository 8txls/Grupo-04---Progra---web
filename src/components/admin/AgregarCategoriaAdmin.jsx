import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './AgregarCategoriaAdmin.css';

const mockAvailableProducts = [
  { id: 'PROD001', name: 'Pollo Entero Fresco', price: 'S/ 9.40 x KG', imageUrl: 'https://placehold.co/50x50/E97451/FFFFFF?text=Pollo' },

];

function AgregarCategoriaAdmin() {
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [descripcionCategoria, setDescripcionCategoria] = useState('');
  const [imagenCategoria, setImagenCategoria] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [productosRelacionados, setProductosRelacionados] = useState([]);
  const [mostrarModalProductos, setMostrarModalProductos] = useState(false);
  const [busquedaProductoModal, setBusquedaProductoModal] = useState('');
  const [productosDisponiblesModal, setProductosDisponiblesModal] = useState(mockAvailableProducts);

  useEffect(() => {
    const filtrados = mockAvailableProducts.filter(p =>
      p.name.toLowerCase().includes(busquedaProductoModal.toLowerCase()) &&
      !productosRelacionados.find(pr => pr.id === p.id)
    );
    setProductosDisponiblesModal(filtrados);
  }, [busquedaProductoModal, productosRelacionados]);

  const handleImagenChange = (e) => { 
    const file = e.target.files[0];
    if (file) {
      setImagenCategoria(file);
      setPreviewImagen(URL.createObjectURL(file));
    } else {
      setImagenCategoria(null);
      setPreviewImagen(null);
    }
  };
  const abrirModalProductos = () => setMostrarModalProductos(true);
  const cerrarModalProductos = () => { 
    setMostrarModalProductos(false);
    setBusquedaProductoModal('');
  };
  const agregarProductoARelacionados = (producto) => { 
    if (!productosRelacionados.find(p => p.id === producto.id)) {
      setProductosRelacionados([...productosRelacionados, producto]);
    }
  };
  const quitarProductoDeRelacionados = (idProducto) => { 
    setProductosRelacionados(productosRelacionados.filter(p => p.id !== idProducto));
  };
  const handleSubmitCategoria = (e) => { 
    e.preventDefault();
    if (!nombreCategoria.trim()) {
        alert("El nombre de la categoría es obligatorio.");
        return;
    }
    console.log("Guardando Categoría:", { nombreCategoria, descripcionCategoria, imagen: imagenCategoria?.name, productosRelacionados });
    alert("Categoría guardada (simulación). Revisa la consola.");
  };

  return (
    <div className="admin-page-container">
      <header className="admin-navbar-standalone">
        <div className="admin-logo-standalone">Mi-Tiendita <span className="admin-dot-standalone">•</span></div>
        <input className="admin-search-standalone" type="text" placeholder="Buscar en admin..." />
        <div className="admin-right-buttons-standalone">
          <button className="admin-panel-btn-standalone">Panel Admin</button>
          <div className="admin-user-icon-standalone">👤 Admin</div>
        </div>
      </header>

      {}
      <nav className="admin-menu-bar-standalone">
        <Link to="/admin/dashboard" className="admin-menu-button">Dashboard</Link>
        <Link to="/admin/productos" className="admin-menu-button">Productos</Link>
        <Link to="/admin/categorias" className="admin-menu-button active">Categorías</Link> {}
        <Link to="/admin/ordenes" className="admin-menu-button">Órdenes</Link>
        <span className="admin-promo-standalone">Administrador</span>
      </nav>

      <main className="admin-content-area">
        <div className="agregar-categoria-content">
          <div className="admin-page-header">
            <h1 className="admin-page-title">Agregar Nueva Categoría</h1>
            <Link to="/admin/categorias" className="admin-button-secondary">
              ← Volver al Listado
            </Link>
          </div>

          <form onSubmit={handleSubmitCategoria} className="admin-form">
            {}
            <div className="admin-form-section">
              <h2 className="admin-section-title">Datos de la Categoría</h2>
              <div className="admin-form-group">
                <label htmlFor="nombreCategoria">Nombre <span className="required-asterisk">*</span></label>
                <input type="text" id="nombreCategoria" className="admin-input-field" value={nombreCategoria} onChange={(e) => setNombreCategoria(e.target.value)} required />
              </div>
              {}
            </div>
            <div className="admin-form-section">
              <h2 className="admin-section-title">Productos Relacionados ({productosRelacionados.length})</h2>
              <button type="button" onClick={abrirModalProductos} className="admin-button-primary add-product-btn">
                ➕ Agregar Producto
              </button>
              {}
            </div>
            <div className="admin-form-actions">
              <button type="submit" className="admin-button-save">💾 Guardar</button>
              <Link to="/admin/categorias" className="admin-button-cancel">Cancelar</Link>
            </div>
          </form>
        </div>
      </main>

      {}
      {mostrarModalProductos && (
        <div className="admin-modal-overlay">
          { }
        </div>
      )}
    </div>
  );
}

export default AgregarCategoriaAdmin;
