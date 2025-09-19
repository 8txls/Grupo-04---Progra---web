const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../models');

// Ruta de registro
router.post('/register', async (req, res) => {
  try {
    const { nombre, apellido, email, dni, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !apellido || !email || !dni || !password) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son obligatorios'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email no es válido'
      });
    }

    // Validar longitud de la contraseña
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres'
      });
    }

    // Validar DNI (solo números y longitud apropiada)
    const dniRegex = /^\d{8}$/;
    if (!dniRegex.test(dni)) {
      return res.status(400).json({
        success: false,
        message: 'El DNI debe tener 8 dígitos'
      });
    }

    // Verificar si el email ya existe
    const existingUserByEmail = await db.user.findOne({
      where: { email: email.toLowerCase() }
    });

    if (existingUserByEmail) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Verificar si el DNI ya existe
    const existingUserByDni = await db.user.findOne({
      where: { dni }
    });

    if (existingUserByDni) {
      return res.status(400).json({
        success: false,
        message: 'El DNI ya está registrado'
      });
    }

    // Encriptar la contraseña
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Crear el usuario
    const newUser = await db.user.create({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.toLowerCase().trim(),
      dni: dni.trim(),
      password: hashedPassword,
      role: 'user'
    });

    // Responder sin incluir la contraseña
    const { password: _, ...userResponse } = newUser.toJSON();

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      user: userResponse
    });

  } catch (error) {
    console.error('Error en el registro:', error);

    // Manejar errores específicos de Sequelize
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        details: error.errors.map(err => err.message)
      });
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'El email o DNI ya están registrados'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta de login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios'
      });
    }

    // Buscar usuario por email
    const user = await db.user.findOne({
      where: { email: email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Responder sin incluir la contraseña
    const { password: _, ...userResponse } = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      user: userResponse
    });

  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para obtener todos los usuarios (solo para admin)
router.get('/', async (req, res) => {
  try {
    const users = await db.user.findAll({
      attributes: { exclude: ['password'] } // Excluir contraseñas
    });

    res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para obtener un usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.user.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para actualizar un usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, dni, role } = req.body;

    const user = await db.user.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar si el nuevo email ya existe (excluyendo el usuario actual)
    if (email && email.toLowerCase() !== user.email) {
      const existingUser = await db.user.findOne({
        where: { 
          email: email.toLowerCase(),
          id: { [db.Sequelize.Op.ne]: id }
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El email ya está en uso por otro usuario'
        });
      }
    }

    // Verificar si el nuevo DNI ya existe (excluyendo el usuario actual)
    if (dni && dni !== user.dni) {
      const existingUser = await db.user.findOne({
        where: { 
          dni,
          id: { [db.Sequelize.Op.ne]: id }
        }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'El DNI ya está en uso por otro usuario'
        });
      }
    }

    // Actualizar usuario
    await user.update({
      nombre: nombre || user.nombre,
      apellido: apellido || user.apellido,
      email: email ? email.toLowerCase() : user.email,
      dni: dni || user.dni,
      role: role || user.role
    });

    // Responder sin incluir la contraseña
    const { password: _, ...userResponse } = user.toJSON();

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: userResponse
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para cambiar contraseña
router.put('/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña actual y nueva son obligatorias'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    const user = await db.user.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'La contraseña actual es incorrecta'
      });
    }

    // Encriptar nueva contraseña
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Actualizar contraseña
    await user.update({ password: hashedNewPassword });

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// Ruta para eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await db.user.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router;