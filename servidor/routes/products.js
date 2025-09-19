const express = require('express');
const router = express.Router();
const db = require('../models');

// ✅ 1. RUTAS ESPECÍFICAS PRIMERO:
router.get('/featured', async (req, res) => {
  try {
    const products = await db.sequelize.query(`
      SELECT id, name, price, price_unit, image_url, old_price, discount, 
             category, description, presentation, stock
      FROM products 
      WHERE is_featured = true AND is_active = true 
      ORDER BY created_at DESC 
      LIMIT 6
    `, {
      type: db.sequelize.QueryTypes.SELECT
    });

    console.log(`✅ Productos destacados encontrados: ${products.length}`);

    res.status(200).json({
      success: true,
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        price: `S/ ${product.price} ${product.price_unit}`,
        imageUrl: product.image_url,
        oldPrice: product.old_price ? `S/ ${product.old_price}` : null,
        discount: product.discount,
        category: product.category,
        description: product.description,
        presentation: product.presentation,
        stock: product.stock
      }))
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

// ✅ 2. RUTAS DEBUG:
router.get('/debug/all-categories', async (req, res) => {
  try {
    const products = await db.sequelize.query(`
      SELECT DISTINCT category, COUNT(*) as count
      FROM products 
      WHERE category IS NOT NULL
      GROUP BY category
      ORDER BY category ASC
    `, {
      type: db.sequelize.QueryTypes.SELECT
    });

    console.log('📂 Categorías en productos:');
    products.forEach(cat => {
      console.log(`   - "${cat.category}" (${cat.count} productos)`);
    });

    res.json({
      success: true,
      categories: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ✅ 3. RUTA POR ID (DESPUÉS de las específicas):
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validar que el ID sea un número
    if (!/^\d+$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }
    
    console.log(`🔍 Buscando producto con ID: ${id}`);
    
    const products = await db.sequelize.query(`
      SELECT id, name, price, price_unit, image_url, old_price, discount, 
             category, description, presentation, stock, is_active, is_featured
      FROM products 
      WHERE id = $1 AND is_active = true
    `, {
      bind: [parseInt(id)], // 🔧 CONVERTIR A ENTERO
      type: db.sequelize.QueryTypes.SELECT
    });

    if (products.length === 0) {
      console.log(`❌ Producto con ID ${id} no encontrado`);
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    const product = products[0];
    console.log(`✅ Producto encontrado: ${product.name}`);
    console.log(`🖼️ Imagen del producto: ${product.image_url}`);

    res.status(200).json({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        price: `S/ ${product.price} ${product.price_unit || ''}`,
        imageUrl: product.image_url,
        oldPrice: product.old_price ? `S/ ${product.old_price}` : null,
        discount: product.discount,
        category: product.category,
        description: product.description,
        presentation: product.presentation,
        stock: product.stock,
        isActive: product.is_active,
        isFeatured: product.is_featured
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener producto por ID:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ✅ 4. RUTA GENERAL (AL FINAL):
router.get('/', async (req, res) => {
  try {
    const { category, featured, active = true } = req.query;
    
    console.log('🔍 Parámetros recibidos:', { category, featured, active });
    
    let sql = `
      SELECT id, name, price, price_unit, image_url, old_price, discount, 
             category, description, presentation, stock, is_active, is_featured,
             created_at
      FROM products 
      WHERE 1=1
    `;
    
    const params = [];
    
    if (category) {
      sql += ` AND category = $${params.length + 1}`;
      params.push(category);
    }
    
    if (featured !== undefined) {
      sql += ` AND is_featured = $${params.length + 1}`;
      params.push(featured === 'true');
    }
    
    if (active !== undefined) {
      sql += ` AND is_active = $${params.length + 1}`;
      params.push(active === 'true');
    }
    
    sql += ` ORDER BY created_at DESC`;

    const products = await db.sequelize.query(sql, {
      bind: params,
      type: db.sequelize.QueryTypes.SELECT
    });

    console.log(`✅ Total productos encontrados: ${products.length}`);
    
    if (category) {
      console.log(`📂 Productos para categoría "${category}":`);
      products.forEach((product, index) => {
        console.log(`   ${index + 1}. ${product.name} - imagen: ${product.image_url}`);
      });
    }

    res.status(200).json({
      success: true,
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        price: `S/ ${product.price} ${product.price_unit || ''}`,
        imageUrl: product.image_url,
        oldPrice: product.old_price ? `S/ ${product.old_price}` : null,
        discount: product.discount,
        category: product.category,
        description: product.description,
        presentation: product.presentation,
        stock: product.stock,
        isActive: product.is_active,
        isFeatured: product.is_featured
      }))
    });
  } catch (error) {
    console.error('❌ Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;