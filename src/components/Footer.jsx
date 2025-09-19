import { Link } from 'react-router-dom';
import React from 'react';
import facebookIcon from '../assets/logofb.png';
import instagramIcon from '../assets/logoig.png';
import twitterIcon from '../assets/logox.png';
import youtubeIcon from '../assets/logoyt.png';

function Footer() {
  return (
    <footer className="app-footer">
      <div className="container footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <h5 className="footer-heading">MiTienda</h5>
            <p>
              Tu tienda online de confianza para encontrar los mejores productos a precios increíbles. Calidad y servicio garantizados.
            </p>
            <div className="social-icons">
              <a href="#" aria-label="Facebook">
                <img src={facebookIcon} alt="Facebook" className="social-icon" />
              </a>
              <a href="#" aria-label="Instagram">
                <img src={instagramIcon} alt="Instagram" className="social-icon" />
              </a>
              <a href="#" aria-label="Twitter">
                <img src={twitterIcon} alt="Twitter" className="social-icon" />
              </a>
              <a href="#" aria-label="Youtube">
                <img src={youtubeIcon} alt="YouTube" className="social-icon" />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h5 className="footer-heading">Enlaces Útiles</h5>
            <ul className="footer-links">
              <li><Link to="/login">Iniciar Sesión</Link></li>
              <li><Link to="/registro">Registrarse</Link></li>
              <li><a href="#">Mis Pedidos</a></li>
              <li><a href="#">Seguimiento de Envío</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h5 className="footer-heading">Mi Cuenta</h5>
            <ul className="footer-links">
              <li><Link to="/login">Iniciar Sesión</Link></li>
              <li><Link to="/registro">Registrarse</Link></li>
              <li><a href="#">Mis Pedidos</a></li>
              <li><a href="#">Seguimiento de Envío</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h5 className="footer-heading">Suscríbete a Novedades</h5>
            <p>Recibe ofertas exclusivas y las últimas noticias directamente en tu correo.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Tu correo electrónico" className="newsletter-input" />
              <button type="submit" className="newsletter-button">Suscribir</button>
            </form>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} MiTienda. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
