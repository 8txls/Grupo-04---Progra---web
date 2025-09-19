import React from 'react';
import Header from './Header';
import Navbar from './Navbar';
import HomePage from './HomePage';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

function HomePageLayout() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };
  return (
    <div className="homepage-layout">
      <Header onLoginClick={handleLoginClick} />
      <Navbar />
      <main className="main-content container">
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}

export default HomePageLayout;
