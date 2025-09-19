import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import './DatosUsuario.css';

function DatosUsuario() {
  const [formData, setFormData] = useState({ nombre: '', apellido: '', correo: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    
    const loggedInUserIdentifier = localStorage.getItem("userEmail"); 
    const storedUsers = JSON.parse(localStorage.getItem("registeredUser")); 
    
    let userToLoad = null;
    if (storedUsers) {
        if (Array.isArray(storedUsers)) {
            userToLoad = storedUsers.find(user => user.email === loggedInUserIdentifier);
        } else { 
            if (storedUsers.email === loggedInUserIdentifier) {
                userToLoad = storedUsers;
            }
        }
    }

    setTimeout(() => {
      if (loggedInUserIdentifier && userToLoad) {
        setFormData({
          nombre: userToLoad.nombre || '',
          apellido: userToLoad.apellido || '',
          correo: userToLoad.email || '', 
        });
      } else {
        setFormData({
          nombre: 'Invitado',
          apellido: 'Prueba',
          correo: 'invitado@example.com',
        });
        if (!loggedInUserIdentifier) {
            setError("Usuario no autenticado. Mostrando datos de ejemplo. Por favor, inicia sesión.");
        } else {
            setError("No se pudo cargar la información del usuario. Mostrando datos de ejemplo.");
        }
      }
      setIsLoading(false);
    }, 500);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    if (error) setError(null);
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage('');

    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.correo.trim()) {
      setError("Todos los campos son obligatorios.");
      setIsSaving(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.correo)) {
        setError("El formato del correo electrónico no es válido.");
        setIsSaving(false);
        return;
    }
    
    console.log("Guardando datos del usuario:", formData);
    setTimeout(() => {
      const loggedInUserIdentifier = localStorage.getItem("userEmail");
      let storedUsers = JSON.parse(localStorage.getItem("registeredUser"));
      let userFoundAndUpdated = false;

      if (storedUsers && loggedInUserIdentifier) {
        const updateUserInStorage = (userCollection) => {
            const userIndex = userCollection.findIndex(user => user.email === loggedInUserIdentifier);
            if (userIndex !== -1) {
                const originalUserData = userCollection[userIndex];
                userCollection[userIndex] = {
                    ...originalUserData,
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    email: formData.correo, 
                };
                if (formData.correo !== loggedInUserIdentifier) {
                    localStorage.setItem("userEmail", formData.correo);
                }
                return true;
            }
            return false;
        };

        if (Array.isArray(storedUsers)) {
            userFoundAndUpdated = updateUserInStorage(storedUsers);
            if (userFoundAndUpdated) {
                localStorage.setItem("registeredUser", JSON.stringify(storedUsers));
            }
        } else { 
            if (storedUsers.email === loggedInUserIdentifier) {
                const originalUserData = storedUsers;
                 storedUsers = {
                    ...originalUserData,
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    email: formData.correo,
                };
                if (formData.correo !== loggedInUserIdentifier) {
                    localStorage.setItem("userEmail", formData.correo);
                }
                localStorage.setItem("registeredUser", JSON.stringify(storedUsers));
                userFoundAndUpdated = true;
            }
        }
      }

      if (userFoundAndUpdated) {
        setSuccessMessage('¡Datos actualizados con éxito!');
      } else {
        setError('No se pudo actualizar el usuario o no estabas autenticado correctamente. Intenta iniciar sesión de nuevo.');
      }
      setIsSaving(false);
    }, 1000);
  };
  
  if (isLoading) {
    return <div className="datos-usuario-page"><div className="datos-usuario-container loading-container">Cargando tus datos...</div></div>;
  }

  return (
    <div className="datos-usuario-page">
      <div className="datos-usuario-container">
        <div className="datos-usuario-header">
          <h1 className="main-title">Mis Datos Personales</h1>
            <Link to="/" className="button-secondary">
              ← Volver a Inicio
            </Link>
         </div>

        <form onSubmit={handleSubmit} className="datos-usuario-form">
          {error && <div className="form-message error-message">{error}</div>}
          {successMessage && <div className="form-message success-message">{successMessage}</div>}

          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              className="form-input"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              className="form-input"
              value={formData.apellido}
              onChange={handleChange}
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              className="form-input"
              value={formData.correo}
              onChange={handleChange}
              required
              disabled={isSaving}
            />
          </div>

          <div className="form-actions" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Link to="/usuario/cambiar-contrasena" className="button-secondary">
              Cambiar Contraseña
            </Link>
            <button type="submit" className="button-primary save-button" disabled={isSaving}>
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DatosUsuario;
