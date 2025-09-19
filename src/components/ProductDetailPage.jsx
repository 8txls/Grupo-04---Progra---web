import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard'; 
import './ProductDetailPage.css'; 

function ProductDetailPage({ addToCart }) { 
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate ID
        if (!id || isNaN(id)) {
          throw new Error('ID de producto no válido');
        }

        console.log('🔍 Cargando producto con ID:', id);
        const response = await fetch(`http://localhost:3001/api/products/${id}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success || !data.product) {
          throw new Error(data.message || 'Producto no encontrado');
        }

        console.log('✅ Producto cargado:', data.product);
        setProduct(data.product);

      } catch (error) {
        console.error('❌ Error:', error);
        setError(error.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleImageError = (e) => {
    console.error('❌ Error cargando imagen del producto:', product?.imageUrl);
    setImageError(true);
    e.target.style.display = 'none';
  };

  const handleImageLoad = () => {
    console.log('✅ Imagen del producto cargada correctamente');
    setImageError(false);
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <div className="loading" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Cargando producto...</h2>
          <p>ID del producto: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-detail-container">
        <div className="error" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <div className="error" style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Producto no encontrado</h2>
          <button onClick={() => navigate('/')}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  // Construir URL completa de la imagen
  const hasValidImageUrl = product.imageUrl && 
                          typeof product.imageUrl === 'string' && 
                          product.imageUrl.trim() !== '';
  const fullImageUrl = hasValidImageUrl ? `http://localhost:3001${product.imageUrl}` : null;

  const similarProducts = []; // Inicializa como un arreglo vacío

  return (
    <div className="product-detail-container">
      <button 
        onClick={() => navigate(-1)} 
        className="back-button" 
      >
        &larr; Volver
      </button>

      <div className="product-detail">
        <div className="product-image-section">
          {fullImageUrl && !imageError ? (
            <img 
              src={fullImageUrl}
              alt={product.name}
              className="product-image"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div 
              className="product-image placeholder-image"
              style={{
                width: '400px',
                height: '300px',
                backgroundColor: '#f5f5f5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                border: '2px dashed #ddd',
                color: '#999'
              }}
            >
              <div style={{ fontSize: '48px' }}>📷</div>
              <div style={{ fontSize: '14px', marginTop: '10px' }}>
                Imagen no disponible
              </div>
              <div style={{ fontSize: '10px', marginTop: '5px' }}>
                {product.name}
              </div>
            </div>
          )}
          
          {imageError && (
            <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
              Error al cargar: {product.imageUrl}
            </div>
          )}
        </div>
        
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          <p className="product-category">{product.category}</p>
          
          <div className="product-pricing">
            <span className="current-price">{product.price}</span>
            {product.oldPrice && (
              <>
                <span className="old-price">{product.oldPrice}</span>
                <span className="discount-badge">{product.discount}% OFF</span>
              </>
            )}
          </div>
          
          <div className="product-description">
            <h3>Descripción</h3>
            <p>{product.description || 'Sin descripción disponible'}</p>
          </div>
          
          <div className="product-presentation">
            <h3>Presentación</h3>
            <p>{product.presentation || 'Sin información de presentación'}</p>
          </div>
          
          <div className="product-stock">
            <p>Stock disponible: {product.stock} unidades</p>
          </div>
          
          <div className="product-actions">
            <button 
              className="add-to-cart-btn"
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
            </button>
          </div>
        </div>
      </div>

      {similarProducts.length > 0 && (
        <section className="similar-products-section">
          <h2 className="similar-products-title">Productos Similares</h2>
          <div className="products-grid similar-products-grid"> 
            {similarProducts.map(p => (
              <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default ProductDetailPage;
