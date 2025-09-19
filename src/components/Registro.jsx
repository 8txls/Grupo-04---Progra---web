import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Registro.css";

function Register() {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        dni: "",
        password: "",
        confirmPassword: "",
    });

    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const { nombre, apellido, email, dni, password, confirmPassword } = formData;

        // Validaciones en el frontend
        if (!nombre || !apellido || !email || !dni || !password || !confirmPassword) {
            setMessage("Todos los campos son obligatorios");
            setMessageType("error");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Las contraseñas no coinciden");
            setMessageType("error");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setMessage("La contraseña debe tener al menos 6 caracteres");
            setMessageType("error");
            setIsLoading(false);
            return;
        }

        // Validar DNI (8 dígitos)
        const dniRegex = /^\d{8}$/;
        if (!dniRegex.test(dni)) {
            setMessage("El DNI debe tener exactamente 8 dígitos");
            setMessageType("error");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: nombre.trim(),
                    apellido: apellido.trim(),
                    email: email.trim(),
                    dni: dni.trim(),
                    password
                })
            });

            const data = await response.json();

            if (data.success) {
                setMessage("Usuario registrado con éxito");
                setMessageType("success");

                // Limpiar formulario
                setFormData({
                    nombre: "",
                    apellido: "",
                    email: "",
                    dni: "",
                    password: "",
                    confirmPassword: "",
                });

                // Redireccionar al login después de 2 segundos
                setTimeout(() => {
                    navigate("/login"); 
                }, 2000);
            } else {
                setMessage(data.message || "Error en el registro");
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
        <div className="register-page">
            <div className="register-box">
                <h2>Registro</h2>

                {message && (
                    <div
                        style={{
                            color: messageType === "error" ? "red" : "green",
                            marginBottom: "10px",
                            textAlign: "center",
                            padding: "10px",
                            border: `1px solid ${messageType === "error" ? "red" : "green"}`,
                            borderRadius: "4px",
                            backgroundColor: messageType === "error" ? "#ffe6e6" : "#e6ffe6"
                        }}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    <div className="form-row">
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                        <input
                            type="text"
                            name="apellido"
                            placeholder="Apellido"
                            value={formData.apellido}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <input
                            type="email"
                            name="email"
                            placeholder="usuario@gmail.com"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                        <input
                            type="text"
                            name="dni"
                            placeholder="DNI (8 dígitos)"
                            value={formData.dni}
                            onChange={handleChange}
                            disabled={isLoading}
                            pattern="[0-9]{8}"
                            maxLength="8"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña (mín. 6 caracteres)"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                            minLength="6"
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirmar contraseña"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                            required
                        />
                    </div>

                    <button type="submit" className="register-button" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Registrarme'}
                    </button>
                </form>

                <button
                    onClick={() => navigate("/login")}
                    className="back-button"
                    disabled={isLoading}
                >
                    ⬅ Volver al inicio
                </button>
            </div>
        </div>
    );
}

export default Register;
