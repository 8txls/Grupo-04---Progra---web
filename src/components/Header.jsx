import React from 'react';
import './Header.css';

function Header({ cartCount, onCartClick, onLoginClick, user, isAuthenticated, onLogout }) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-container">
          <a href="/" className="mitienda-logo-button">
            Mi Tiendita
          </a>
        </div>
        
        <div className="search-bar-wrapper">
          <div className="search-bar-container">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Buscar productos..." 
            />
            <button className="search-icon-wrapper">
              🔍
            </button>
          </div>
        </div>
        
        <div className="header-actions">
          {/* Carrito */}
          <button onClick={onCartClick} className="action-button cart-button">
            🛒
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </button>
          
          {/* Estado de autenticación */}
          {isAuthenticated ? (
            <>
              <div className="user-display">
                👤 Hola, {user?.nombre || 'Usuario'}
              </div>
              <button onClick={onLogout} className="logout-button">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <button onClick={onLoginClick} className="action-button user-button">
              <div className="user-info">
                👤
                <span className="user-label">Iniciar Sesión</span>
              </div>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
