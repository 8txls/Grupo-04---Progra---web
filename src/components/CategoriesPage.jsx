import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import './CategoriesPage.css';

function CategoriesPage({ addToCart }) {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos de la categoría desde la API
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        console.log('🔍 Cargando productos para categoría:', categoryName);
        
        const url = `http://localhost:3001/api/products?category=${encodeURIComponent(categoryName)}`;
        console.log('📡 URL de solicitud:', url);
        
        const response = await fetch(url);
        const data = await response.json();
        
        console.log('📦 Respuesta del servidor:', data);
        
        if (data.success) {
          console.log(`✅ ${data.products.length} productos encontrados para "${categoryName}"`);
          
          // DEBUG: Verificar imágenes de cada producto
          data.products.forEach((product, index) => {
            console.log(`🖼️ Producto ${index + 1}: ${product.name}`);
            console.log(`   - imageUrl: "${product.imageUrl}"`);
            console.log(`   - URL completa: http://localhost:3001${product.imageUrl}`);
          });
          
          setProducts(data.products);
        } else {
          console.error('❌ Error en respuesta:', data.message);
          setError(data.message || 'Error al cargar productos de la categoría');
        }
      } catch (error) {
        console.error('❌ Error al cargar productos:', error);
        setError('Error de conexión al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchCategoryProducts();
    } else {
      console.warn('⚠️ No se proporcionó categoryName');
      setLoading(false);
    }
  }, [categoryName]);

  if (loading) {
    return (
      <div className="categories-page-container">
        <div className="loading">
          <p>Cargando productos de {categoryName}...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="categories-page-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="categories-page-container">
      <div className="categories-header">
        <h1>Productos de {categoryName}</h1>
        <p>Encontramos {products.length} productos en esta categoría</p>
      </div>
      
      {products.length > 0 ? (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      ) : (
        <div className="no-products">
          <h3>Sin productos</h3>
          <p>No hay productos disponibles en la categoría "{categoryName}"</p>
          <p>Prueba con otra categoría o vuelve al inicio</p>
        </div>
      )}
    </div>
  );
}

export default CategoriesPage;
