import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CategoryCard({ category }) {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  // DEBUG: Ver qué datos llegan al CategoryCard
  console.log(`🔍 CategoryCard para: ${category.name}`);
  console.log(`   - imageUrl: "${category.imageUrl}"`);
  console.log(`   - URL completa que se usará: http://localhost:3001${category.imageUrl}`);

  const handleClick = () => {
    navigate(`/categoria/${encodeURIComponent(category.name)}`);
  };

  // Validar si tiene una URL de imagen válida
  const hasValidImageUrl = category.imageUrl && 
                          typeof category.imageUrl === 'string' && 
                          category.imageUrl.trim() !== '' &&
                          category.imageUrl !== 'null' &&
                          category.imageUrl !== 'undefined';

  // Construir URL completa de la imagen
  const imageUrl = hasValidImageUrl ? `http://localhost:3001${category.imageUrl}` : null;

  const handleImageError = (e) => {
    console.error('❌ Error cargando imagen de categoría:', category.imageUrl);
    console.log('🔗 URL completa que falló:', e.target.src);
    setImageError(true);
  };

  const handleImageLoad = () => {
    console.log(`✅ Imagen de categoría cargada correctamente: ${category.imageUrl}`);
    setImageError(false);
  };

  return (
    <div 
      className="category-card" 
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="category-image-container">
        {hasValidImageUrl && !imageError ? (
          <img 
            src={imageUrl}
            alt={category.name}
            className="category-image"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div 
            className="category-image placeholder-image"
            style={{
              width: '100%',
              height: '150px',
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              border: '2px dashed #ddd',
              color: '#999'
            }}
          >
            <div style={{ fontSize: '24px' }}>📂</div>
            <div style={{ fontSize: '12px', marginTop: '5px' }}>
              {!hasValidImageUrl ? 'Sin imagen configurada' : 'Imagen no disponible'}
            </div>
            <div style={{ fontSize: '10px', marginTop: '2px' }}>
              {category.name}
            </div>
            {!hasValidImageUrl && (
              <div style={{ fontSize: '8px', marginTop: '2px', color: '#ccc' }}>
                imageUrl: "{category.imageUrl}"
              </div>
            )}
          </div>
        )}
      </div>

      <div className="category-info">
        <h3 className="category-name">{category.name}</h3>
        {category.description && (
          <p className="category-description">{category.description}</p>
        )}
      </div>
    </div>
  );
}

export default CategoryCard;