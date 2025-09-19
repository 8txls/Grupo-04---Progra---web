import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LayoutAdmin from './LayoutAdmin.jsx';
import ModalCategoria from './Modalcategoria.jsx';
import './agregarproductoAdmi.css';

const categoriasIniciales = [
  "Frutas y Verduras",
  "Desayunos",
  "Carnes, Aves y Pescados",
  "Lácteos y Huevos",
  "Quesos y fiambres",
  "Abarrotes",
  "Panadería ",
  "Congelados",
];

function AgregarProducto() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    nombre: '',
    presentacion: '',
    categoria: '',
    descripcion: '',
    imagen: '',
    stock: 0,
  });

  const [categorias, setCategorias] = useState(() => {
    return JSON.parse(localStorage.getItem('categorias')) || categoriasIniciales;
  });

  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    if (location.pathname.includes('editar')) {
      const editar = localStorage.getItem('productoEditando');
      if (editar) {
        setFormData(JSON.parse(editar));
        setModoEdicion(true);
      }
    } else {
      // Si es ruta nueva
      setFormData({
        nombre: '',
        presentacion: '',
        categoria: '',
        descripcion: '',
        imagen: '',
        stock: 0,
      });
      setModoEdicion(false);
      localStorage.removeItem('productoEditando');
    }
  }, [location.pathname]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagen: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const guardarProducto = () => {
    const { nombre, presentacion, categoria, descripcion } = formData;

    if (!nombre || !presentacion || !categoria || !descripcion) {
      alert("Completa todos los campos antes de guardar.");
      return;
    }

    const productos = JSON.parse(localStorage.getItem('productos')) || [];

    if (modoEdicion) {
      const index = productos.findIndex(p => p.id === formData.id);
      if (index !== -1) {
        productos[index] = formData;
      }
      alert('Producto editado correctamente');
    } else {
      formData.id = Date.now(); // ID único
      productos.push(formData);
      alert('Producto creado correctamente');
    }

    localStorage.setItem('productos', JSON.stringify(productos));
    localStorage.removeItem('productoEditando');
    setModoEdicion(false);
    navigate('/admin/productos');
  };

  const agregarCategoria = (nuevaCat) => {
    const nuevasCategorias = [...categorias, nuevaCat.nombre];
    setCategorias(nuevasCategorias);
    setFormData(prev => ({ ...prev, categoria: nuevaCat.nombre }));
    localStorage.setItem('categorias', JSON.stringify(nuevasCategorias));
    setMostrarModal(false);
  };

  const incrementarStock = () => setFormData(p => ({ ...p, stock: p.stock + 1 }));
  const decrementarStock = () => setFormData(p => ({ ...p, stock: Math.max(p.stock - 1, 0) }));

  return (
    <>
      <LayoutAdmin />
      <div className="form-container">
        <h1>{modoEdicion ? 'Editar producto' : 'Agregar un producto'}</h1>

        <div className="form-card">
          <div className="form-left">
            <label>Nombre del producto</label>
            <input name="nombre" type="text" value={formData.nombre} onChange={handleInputChange} />

            <label>Presentación</label>
            <input name="presentacion" type="text" value={formData.presentacion} onChange={handleInputChange} />

            <label>Categoría</label>
            <div className="input-group">
              <select name="categoria" value={formData.categoria} onChange={handleInputChange}>
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
              </select>
              <button onClick={() => setMostrarModal(true)}>➕</button>
            </div>

            <label>Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} />
          </div>

          <div className="form-right">
            <label>Imagen</label>
            <div className="dropzone">
              {formData.imagen ? (
                <img src={formData.imagen} alt="Producto" className="preview" />
              ) : (
                <p>📁 Selecciona o arrastra una imagen</p>
              )}
              <input type="file" onChange={handleImagen} />
            </div>

            <label>Stock</label>
            <div className="stock-group">
              <button onClick={decrementarStock}>−</button>
              <input type="number" value={formData.stock} readOnly />
              <button onClick={incrementarStock}>+</button>
            </div>

            <button className="btn-primary" onClick={guardarProducto}>
              {modoEdicion ? '💾 Editar producto' : '✔ Crear producto'}
            </button>
          </div>
        </div>

        {mostrarModal && (
          <ModalCategoria onClose={() => setMostrarModal(false)} onSave={agregarCategoria} />
        )}
      </div>
    </>
  );
}

export default AgregarProducto;
