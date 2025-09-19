
import React from 'react';

function Navbar() { 
  const categories = ['Inicio', 'Nosotros', 'Productos', 'Categorias'];

  const routes = {
    'Inicio'      : '/',
    'Nosotros'   : '/nosotros',
    'Productos'   : '/productos',
    'Categorias'  : '/categorias',
  };

  return (
    <nav className="main-navbar">
      <div className="container">
        <ul className="nav-list">
          {categories.map((category) => (
            <li key={category} className="nav-item">
              <a href={routes[category]} className="nav-link">
                {category}
              </a>
            </li>
          ))}
          <li className="nav-item">
            <a href="#" className="nav-link offers-link">
              Ofertas
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;