const express = require('express');
const router = express.Router();
const db = require('../models');

// Crear nueva orden
router.post('/', async (req, res) => {
  const t = await db.sequelize.transaction();
  
  try {
    const { cliente, items, shippingAddress, totalAmount } = req.body;
    
    // Log incoming data
    console.log('📦 Received order data:', {
      cliente,
      itemsCount: items?.length,
      shippingAddress,
      totalAmount
    });
    
    // Enhanced validation with type checking
    const errors = [];
    
    // Client validation
    if (!cliente?.nombre?.trim()) errors.push('Nombre del cliente es requerido');
    if (!cliente?.correo?.trim()) errors.push('Email del cliente es requerido');
    if (!cliente?.telefono?.trim()) errors.push('Teléfono del cliente es requerido');
    
    // Address validation
    if (!shippingAddress?.trim()) {
      errors.push('Dirección de envío es requerida');
    } else if (shippingAddress.trim().length < 10) {
      errors.push('La dirección debe tener al menos 10 caracteres');
    }
    
    // Amount validation
    const parsedAmount = parseFloat(totalAmount);
    if (!totalAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      errors.push('Monto total debe ser mayor a 0');
    }
    
    // Items validation
    if (!Array.isArray(items) || items.length === 0) {
      errors.push('Debe incluir al menos un producto');
    } else {
      const invalidItems = items.filter(item => 
        !item.id || !item.quantity || !item.price || 
        isNaN(parseInt(item.quantity)) || 
        isNaN(parseFloat(item.price))
      );
      if (invalidItems.length > 0) {
        errors.push('Uno o más productos tienen datos inválidos');
      }
    }

    if (errors.length > 0) {
      throw new Error(JSON.stringify({
        type: 'ValidationError',
        errors: errors
      }));
    }

    // Create order with validated and sanitized data
    const order = await db.Order.create({
      clientName: cliente.nombre.trim(),
      clientEmail: cliente.correo.trim().toLowerCase(),
      clientPhone: cliente.telefono.replace(/\D/g, ''),
      shippingAddress: shippingAddress.trim(),
      totalAmount: parsedAmount,
      status: 'Procesando',
      paymentMethod: 'Tarjeta'
    }, { transaction: t });

    console.log('✅ Created order:', order.id);

    // Create order items with validated data
    await Promise.all(items.map(item => 
      db.OrderItem.create({
        orderId: order.id,
        productId: parseInt(item.id),
        quantity: parseInt(item.quantity),
        unitPrice: parseFloat(item.price),
        totalPrice: parseInt(item.quantity) * parseFloat(item.price)
      }, { transaction: t })
    ));

    await t.commit();
    console.log('✅ Transaction committed for order:', order.id);

    // Fetch complete order with items
    const completeOrder = await db.Order.findByPk(order.id, {
      include: [{
        model: db.OrderItem,
        as: 'items',
        include: [{
          model: db.Product,
          as: 'product'
        }]
      }]
    });

    res.status(201).json({
      success: true,
      order: completeOrder
    });

  } catch (error) {
    await t.rollback();
    console.error('❌ Error creating order:', error);
    
    // Handle validation errors differently
    try {
      const parsedError = JSON.parse(error.message);
      if (parsedError.type === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Error de validación',
          details: parsedError.errors
        });
      }
    } catch {
      // Not a validation error, continue with generic error handling
    }

    res.status(400).json({
      success: false,
      message: error.message || 'Error al crear la orden',
      details: error.errors?.map(e => e.message) || ['Error desconocido']
    });
  }
});

// Obtener orden por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Buscando orden:', id);

    // Validate order ID format
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'ID de orden inválido'
      });
    }

    const order = await db.Order.findByPk(id, {
      include: [{
        model: db.OrderItem,
        as: 'items',
        include: [{
          model: db.Product,
          as: 'product'
        }]
      }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Orden no encontrada'
      });
    }

    // Transform order data before sending
    const transformedOrder = {
      id: order.id,
      clientName: order.clientName,
      clientEmail: order.clientEmail,
      clientPhone: order.clientPhone,
      shippingAddress: order.shippingAddress,
      totalAmount: parseFloat(order.totalAmount),
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: parseFloat(item.unitPrice),
        totalPrice: parseFloat(item.totalPrice),
        product: item.product ? {
          id: item.product.id,
          name: item.product.name,
          price: parseFloat(item.product.price),
          image_url: item.product.image_url,
          presentation: item.product.presentation
        } : null
      }))
    };

    res.json({
      success: true,
      order: transformedOrder
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar la orden',
      error: error.message
    });
  }
});

module.exports = router;