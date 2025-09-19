import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import CategoryCard from './CategoryCard';
import './HomePage.css';

import bannerPrincipal from '../assets/bannerpromocional.png';

const bannerImages = [
  bannerPrincipal,
  "https://placehold.co/1200x400/A8D8C0/FFFFFF?text=Ofertas+Frescas+de+Verano", 
  "https://placehold.co/1200x400/FFDAB9/8B4513?text=Descuentos+Especiales", 
  "https://placehold.co/1200x400/E6E6FA/483D8B?text=Novedades+del+Mes", 
];

const PRODUCTS_PER_PAGE = 3; 

function HomePage({ addToCart }) {
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentProductPage, setCurrentProductPage] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar productos destacados desde la API
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        console.log('Iniciando fetch de productos destacados...');
        const response = await fetch('http://localhost:3001/api/products/featured');
        const data = await response.json();
        
        if (data.success) {
          console.log('📦 Productos recibidos:', data.products);
          
          // Debugging detallado de URLs
          data.products.forEach((product, index) => {
            console.log(`🖼️ Producto ${index + 1}: ${product.name}`);
            console.log(`   - URL imagen: ${product.imageUrl}`);
            console.log(`   - URL completa: http://localhost:3001${product.imageUrl}`);
          });
          
          setFeaturedProducts(data.products);
        } else {
          setError('Error al cargar productos destacados');
        }
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setError('Error de conexión al cargar productos');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Cargar categorías desde la API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('🔍 Cargando categorías...');
        const response = await fetch('http://localhost:3001/api/categories');
        const data = await response.json();
        
        console.log('📦 Respuesta de categorías:', data);
        
        if (data.success) {
          console.log(`✅ ${data.categories.length} categorías encontradas:`);
          data.categories.forEach((category, index) => {
            console.log(`   ${index + 1}. ${category.name}`);
            console.log(`      - imageUrl: "${category.imageUrl}"`);
            console.log(`      - URL completa: http://localhost:3001${category.imageUrl}`);
          });
          
          setCategories(data.categories);
        } else {
          console.error('❌ Error en respuesta de categorías:', data.message);
          setError('Error al cargar categorías');
        }
      } catch (error) {
        console.error('❌ Error al cargar categorías:', error);
        setError('Error de conexión al cargar categorías');
      }
    };

    fetchCategories();
  }, []);

  // Banner automático
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
    }, 4000); 
    return () => clearInterval(timer);
  }, []);

  const totalProductPages = Math.ceil(featuredProducts.length / PRODUCTS_PER_PAGE);

  const handleNextProducts = () => {
    setCurrentProductPage((prevPage) => (prevPage + 1) % totalProductPages);
  };

  const handlePrevProducts = () => {
    setCurrentProductPage((prevPage) => (prevPage - 1 + totalProductPages) % totalProductPages);
  };

  const startIndex = currentProductPage * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const displayedProducts = featuredProducts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="homepage-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '18px' 
        }}>
          Cargando productos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          fontSize: '18px',
          color: 'red' 
        }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="homepage-container">
      <section
        className="banner-section"
        style={{ backgroundImage: `url(${bannerImages[currentBannerIndex]})` }}
      >
        <div className="banner-text-overlay">
          <h1>¡Las Mejores Ofertas!</h1>
          <p>Descubre productos increíbles a precios inigualables esta temporada.</p>
          <button className="promo-button">VER TODAS LAS OFERTAS</button>
        </div>
      </section>

      <section className="products-section">
        <div className="section-header-controls">
          <button
            className="arrow-button prev-arrow"
            onClick={handlePrevProducts}
            disabled={featuredProducts.length <= PRODUCTS_PER_PAGE}
          >
            &lt;
          </button>
          <h2 className="section-title"><span>Productos Destacados</span></h2>
          <button
            className="arrow-button next-arrow"
            onClick={handleNextProducts}
            disabled={featuredProducts.length <= PRODUCTS_PER_PAGE}
          >
            &gt;
          </button>
        </div>
        
        {displayedProducts.length > 0 ? (
          <div className="products-grid">
            {displayedProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>No hay productos destacados disponibles</p>
          </div>
        )}
      </section>

      <section className="categories-section">
        <h2 className="section-title"><span>Explorar Categorías</span></h2>
        {categories.length > 0 ? (
          <div className="categories-grid">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p>No hay categorías disponibles</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;