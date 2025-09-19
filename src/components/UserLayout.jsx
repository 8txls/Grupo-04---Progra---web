import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/autenticacion'; // Corregir la ruta de importación
import Header from './Header';
import Navbar from './Navbar';
import Footer from './Footer';

function UserLayout({ children, cartCount, onCartClick, onLoginClick }) {
  const navigate = useNavigate(); // Agregar useNavigate
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <>
      <Header
        cartCount={cartCount}
        onCartClick={onCartClick}
        onLoginClick={handleLoginClick}
        user={user}
        isAuthenticated={isAuthenticated()}
        onLogout={handleLogout}
      />
      <Navbar />
      <main className="main-content container">{children}</main>
      <Footer />
    </>
  );
}

export default UserLayout;