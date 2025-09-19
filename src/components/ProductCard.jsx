import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationCard from './Notification';

function ProductCard({ product, onAddToCart }) {
  const [showNotification, setShowNotification] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const navigate = useNavigate();

  if (!product || !product.id) {
    console.warn("ProductCard recibió un producto inválido:", product);
    return null; 
  }

  // DEBUG: Ver qué datos llegan al ProductCard
  console.log(`🔍 ProductCard para: ${product.name}`);
  console.log(`   - imageUrl: "${product.imageUrl}"`);
  console.log(`   - URL completa que se usará: http://localhost:3001${product.imageUrl}`);

  const handleCardClick = () => {
    navigate(`/producto/${product.id}`); 
  };

  const handleAddToCartClick = (e) => {
    e.stopPropagation(); 
    onAddToCart(product);

    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const ShoppingCartIcon = () => <span role="img" aria-label="Agregar al carrito">🛒</span>;

  // Validar si tiene una URL de imagen válida
  const hasValidImageUrl = product.imageUrl && 
                          typeof product.imageUrl === 'string' && 
                          product.imageUrl.trim() !== '' &&
                          product.imageUrl !== 'null' &&
                          product.imageUrl !== 'undefined';

  // 🔧 CONSTRUCCIÓN CORRECTA DE LA URL DE IMAGEN
  const imageUrl = hasValidImageUrl ? `http://localhost:3001${product.imageUrl}` : null;

  const handleImageError = (e) => {
    console.error('❌ Error cargando imagen:', product.imageUrl);
    console.log('🔗 URL completa que falló:', e.target.src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log(`✅ Imagen cargada correctamente: ${product.imageUrl}`);
    setImageError(false);
  };

  return (
    <div 
      className="product-card" 
      onClick={handleCardClick} 
      style={{ cursor: 'pointer' }}
      role="link" 
      tabIndex={0} 
      onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCardClick(); }}
    >
      {showNotification && (
        <div className="notification-container">
          <NotificationCard title={``} message="¡Tu producto ha sido añadido exitosamente!" />
        </div>
      )}

      <div className="product-image-container">
        {hasValidImageUrl && !imageError ? (
          <img 
            src={imageUrl}  // 🔧 USAR LA URL COMPLETA
            alt={product.name}
            className="product-image"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div 
            className="product-image placeholder-image"
            style={{
              width: '100%',
              height: '200px',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              border: '2px dashed #ddd',
              color: '#999'
            }}
          >
            <div>📷</div>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              {!hasValidImageUrl ? 'Sin imagen configurada' : 'Imagen no disponible'}
            </div>
            <div style={{ fontSize: '10px', marginTop: '2px' }}>
              {product.name.substring(0, 20)}
            </div>
            {!hasValidImageUrl && (
              <div style={{ fontSize: '8px', marginTop: '2px', color: '#ccc' }}>
                imageUrl: "{product.imageUrl}"
              </div>
            )}
          </div>
        )}
        
        {product.discount && (
          <span className="product-discount-badge">
            {product.discount} OFF
          </span>
        )}
      </div>

      <div className="product-info">
        <h3 className="product-name" title={product.name}>{product.name}</h3>

        {product.category && (
          <p className="product-category">{product.category}</p>
        )}

        <div className="product-pricing">
          <p className="product-price">{product.price}</p>
          {product.oldPrice && (
            <p className="product-old-price">{product.oldPrice}</p>
          )}
        </div>

        <button
          className="add-to-cart-button"
          onClick={handleAddToCartClick} 
        >
          <span className="cart-icon-button-inner">
            <ShoppingCartIcon />
          </span>  
          Agregar al Carrito
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
