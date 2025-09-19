module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    clientName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'client_name',
      validate: {
        notEmpty: {
          msg: 'El nombre del cliente es requerido'
        },
        len: {
          args: [2, 100],
          msg: 'El nombre debe tener entre 2 y 100 caracteres'
        }
      }
    },
    clientEmail: {
      type: DataTypes.STRING,
      field: 'client_email',
      validate: {
        isEmail: {
          msg: 'Formato de email inválido'
        }
      }
    },
    clientPhone: {
      type: DataTypes.STRING,
      field: 'client_phone',
      validate: {
        is: {
          args: /^\d{9}$/,
          msg: 'El teléfono debe tener 9 dígitos'
        }
      }
    },
    shippingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'shipping_address',
      validate: {
        notEmpty: {
          msg: 'La dirección de envío es requerida'
        },
        len: {
          args: [10, 255],
          msg: 'La dirección debe tener entre 10 y 255 caracteres'
        }
      }
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: 'total_amount',
      validate: {
        notNull: {
          msg: 'El monto total es requerido'
        },
        min: {
          args: [1],
          msg: 'El monto total debe ser mayor a 0'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('Procesando', 'Preparando', 'Enviado', 'Entregado', 'Cancelado'),
      defaultValue: 'Procesando',
      validate: {
        isIn: {
          args: [['Procesando', 'Preparando', 'Enviado', 'Entregado', 'Cancelado']],
          msg: 'Estado inválido'
        }
      }
    },
    paymentMethod: {
      type: DataTypes.STRING,
      field: 'payment_method',
      defaultValue: 'Tarjeta',
      validate: {
        isIn: {
          args: [['Tarjeta', 'Efectivo', 'Transferencia']],
          msg: 'Método de pago inválido'
        }
      }
    }
  }, {
    tableName: 'orders',
    timestamps: true,
    underscored: true,
    hooks: {
      beforeValidate: (order) => {
        if (!order.id) {
          const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
          console.log('📝 Generating new order ID:', orderId);
          order.id = orderId;
        }
      },
      beforeCreate: async (order) => {
        // Ensure totalAmount is a number and positive
        if (typeof order.totalAmount === 'string') {
          order.totalAmount = parseFloat(order.totalAmount);
        }
        if (isNaN(order.totalAmount) || order.totalAmount <= 0) {
          throw new Error('Monto total inválido');
        }
      },
      afterCreate: (order) => {
        console.log('✅ Order created successfully:', order.id);
      }
    }
  });

  Order.associate = function(models) {
    Order.hasMany(models.OrderItem, {
      foreignKey: 'order_id',
      as: 'items',
      onDelete: 'CASCADE'
    });
  };

  return Order;
};