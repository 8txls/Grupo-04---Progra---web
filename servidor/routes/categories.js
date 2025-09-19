const express = require('express');
const router = express.Router();
const db = require('../models');

// Obtener todas las categorías activas
router.get('/', async (req, res) => {
  try {
    // 🔧 USAR is_active en lugar de isActive para la tabla categories:
    const categories = await db.sequelize.query(`
      SELECT id, name, image_url, description, is_active
      FROM categories 
      WHERE is_active = true 
      ORDER BY name ASC
    `, {
      type: db.sequelize.QueryTypes.SELECT
    });

    console.log(`✅ Encontradas ${categories.length} categorías activas`);

    res.status(200).json({
      success: true,
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        imageUrl: category.image_url, // 🔧 MAPEAR CORRECTAMENTE
        description: category.description,
        isActive: category.is_active  // 🔧 MAPEAR snake_case a camelCase
      }))
    });
  } catch (error) {
    console.error('❌ Error al obtener categorías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Ruta debug para ver todas las categorías
router.get('/debug', async (req, res) => {
  try {
    const categories = await db.sequelize.query(`
      SELECT id, name, image_url, description, is_active
      FROM categories 
      ORDER BY name ASC
    `, {
      type: db.sequelize.QueryTypes.SELECT
    });

    console.log('🔍 Debug de categorías:');
    categories.forEach(cat => {
      console.log(`   - ${cat.name} | activa: ${cat.is_active} | imagen: ${cat.image_url}`);
    });

    res.json({
      success: true,
      totalCategories: categories.length,
      categories: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;