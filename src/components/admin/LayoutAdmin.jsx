import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './layoutAdmin.css';

function LayoutAdmin({ children }) {
  const { pathname } = useLocation();
  
  const isActive = (path) => {
    if (path === "/admin/dashboard") return pathname === path;
    return pathname.startsWith(path);
  };
  
  const getActiveRouteBase = () => {
    if (pathname.startsWith("/admin/categorias")) return "/admin/categorias";
    if (pathname.startsWith("/admin/productos")) return "/admin/productos";
    if (pathname.startsWith("/admin/ordenes")) return "/admin/ordenes";
    if (pathname.startsWith("/admin/dashboard")) return "/admin/dashboard";
    return pathname;
  }

  return (
    <div className="admin-layout-wrapper">
      <nav className="navbar-admin">
        <div className="logo">
          🛍️ MiTienda <span className="dot">•</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/admin/dashboard" className={getActiveRouteBase() === '/admin/dashboard' ? 'active' : ''}>Dashboard</Link></li>
          <li><Link to="/admin/productos" className={getActiveRouteBase() === '/admin/productos' ? 'active' : ''}>Productos</Link></li>
          <li><Link to="/admin/categorias" className={getActiveRouteBase() === '/admin/categorias' ? 'active' : ''}>Categorías</Link></li>
          <li><Link to="/admin/ordenes" className={getActiveRouteBase() === '/admin/ordenes' ? 'active' : ''}>Órdenes</Link></li>
        </ul>
        <div className="admin-panel">🧑‍💻 Admin</div>
      </nav>
      <main className="admin-content-main">{children}</main>
    </div>
  );
}

export default LayoutAdmin;
