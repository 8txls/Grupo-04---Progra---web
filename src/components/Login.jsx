import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../components/autenticacion"; // Asegúrate de que la ruta sea correcta
import "./Login.css";

function Login({ onBack, onRegisterClick, onRecoverClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Obtener la ruta desde donde vino el usuario
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const { email, password } = formData;

    if (!email || !password) {
      setMessage("Email y contraseña son obligatorios");
      setMessageType("error");
      setIsLoading(false);
      return;
    }

    const emailInput = email.trim().toLowerCase();

    // Verificar si es admin (hardcodeado)
    if (emailInput === "admin" && password === "admin123") {
      const adminUser = { 
        id: 0,
        email: "admin", 
        role: "admin", 
        nombre: "Administrador",
        apellido: "Sistema",
        dni: "00000000"
      };
      
      login(adminUser);
      
      setMessage("Inicio de sesión como administrador");
      setMessageType("success");

      setTimeout(() => {
        navigate("/admin");
      }, 1000);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailInput,
          password
        })
      });

      const data = await response.json();

      if (data.success) {
        // Usar el contexto de autenticación para hacer login
        login(data.user);

        setMessage("Inicio de sesión exitoso");
        setMessageType("success");

        // Limpiar formulario
        setFormData({
          email: "",
          password: ""
        });

        // Redireccionar según el rol o a la página anterior
        setTimeout(() => {
          if (data.user.role === 'admin') {
            navigate("/admin");
          } else {
            navigate(from, { replace: true });
          }
        }, 1000);
      } else {
        setMessage(data.message || "Error en el login");
        setMessageType("error");
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage("Error de conexión. Verifica que el servidor esté funcionando.");
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        
        {message && (
          <div
            style={{
              color: messageType === "error" ? "red" : "green",
              marginBottom: "10px",
              textAlign: "center",
              padding: "10px",
              border: `1px solid ${messageType === "error" ? "red" : "green"}`,
              borderRadius: "4px",
              backgroundColor: messageType === "error" ? "#ffe6e6" : "#e6ffe6",
              fontWeight: "bold"
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="usuario@gmail.com"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
          />

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="register-link" style={{ marginTop: "10px", textAlign: "center" }}>
          ¿No tienes cuenta?{" "}
          <button
            onClick={onRegisterClick}
            disabled={isLoading}
            style={{ 
              background: "none", 
              border: "none", 
              color: isLoading ? "#ccc" : "#007BFF", 
              cursor: isLoading ? "not-allowed" : "pointer" 
            }}
          >
            Regístrate
          </button>
          <br />
          <button
            onClick={onRecoverClick}
            disabled={isLoading}
            style={{
              background: "none",
              border: "none",
              color: isLoading ? "#ccc" : "#007BFF",
              cursor: isLoading ? "not-allowed" : "pointer",
              marginTop: "10px",
              display: "inline-block",
              padding: 0
            }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </p>

        <button
          onClick={onBack}
          disabled={isLoading}
          style={{
            marginTop: "20px",
            backgroundColor: isLoading ? "#ccc" : "#ddd",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          ⬅ Volver al inicio
        </button>
      </div>
    </div>
  );
}

export default Login;
