import React, { useState } from 'react';
import './Checkout.css';

function Checkout({ cartItems, onBackToCart, onOrderComplete }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [completedOrderData, setCompletedOrderData] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const calculateSummary = () => {
    const subtotal = cartItems.reduce((s, i) => {
      const priceString = i.price.replace(/[^0-9.,]/g, '').replace(',', '.');
      const num = parseFloat(priceString);
      return s + (isNaN(num) ? 0 : num) * i.quantity;
    }, 0);
    const delivery = 10.00; // Fixed delivery cost
    const discounts = 0.00;
    const total = subtotal + delivery - discounts;
    return { subtotal, delivery, discounts, total };
  };

  const summary = calculateSummary();

  // Update the validateForm function
  const validateForm = () => {
    const errors = {};
    
    // Name validation
    if (!form.name?.trim()) {
      errors.name = 'Nombre es requerido';
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!form.email?.trim()) {
      errors.email = 'Email es requerido';
    } else if (!emailRegex.test(form.email.trim())) {
      errors.email = 'Email no válido';
    }

    // Address validation - ensure minimum length
    if (!form.address?.trim()) {
      errors.address = 'Dirección es requerida';
    } else if (form.address.trim().length < 10) {
      errors.address = 'Dirección debe tener al menos 10 caracteres';
    }

    // Phone validation
    if (!form.phone?.trim()) {
      errors.phone = 'Teléfono es requerido';
    } else if (!/^\d{9}$/.test(form.phone.replace(/\D/g, ''))) {
      errors.phone = 'Teléfono debe tener 9 dígitos';
    }

    // Cart validation
    if (!cartItems?.length) {
      errors.cart = 'El carrito está vacío';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateOrderData = (orderData) => {
    const errors = [];
    
    // Client validation
    if (!orderData.cliente.nombre) {
      errors.push('Nombre del cliente es requerido');
    }
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!orderData.cliente.correo || !emailRegex.test(orderData.cliente.correo)) {
      errors.push('Email del cliente es inválido');
    }
    
    if (!orderData.cliente.telefono || !/^\d{9}$/.test(orderData.cliente.telefono)) {
      errors.push('Teléfono del cliente debe tener 9 dígitos');
    }

    // Address validation
    if (!orderData.shippingAddress || orderData.shippingAddress.length < 10) {
      errors.push('La dirección debe tener al menos 10 caracteres');
    }

    // Amount validation
    if (!orderData.totalAmount || orderData.totalAmount <= 0) {
      errors.push('El monto total debe ser mayor a 0');
    }

    // Items validation
    if (!orderData.items || orderData.items.length === 0) {
      errors.push('Debe incluir al menos un producto');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      // Get calculated summary with delivery cost
      const orderSummary = calculateSummary();

      const orderData = {
        cliente: {
          nombre: form.name.trim(),
          correo: form.email.toLowerCase().trim(),
          telefono: form.phone.replace(/\D/g, ''),
        },
        shippingAddress: form.address.trim(),
        totalAmount: orderSummary.total, // Include delivery in total
        items: cartItems.map(item => ({
          id: parseInt(item.id),
          quantity: parseInt(item.quantity),
          price: parseFloat(item.price.replace(/[^0-9.,]/g, '').replace(',', '.'))
        }))
      };

      console.log('📦 Enviando orden:', orderData);

      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.details && Array.isArray(result.details)) {
          throw new Error(result.details.join('\n'));
        }
        throw new Error(result.message || 'Error al crear la orden');
      }

      console.log('✅ Orden creada:', result.order);
      
      // Store the order ID for navigation
      const orderId = result.order.id;
      
      // Show success modal first
      setCompletedOrderData({
        id: orderId,
        cliente: {
          nombre: form.name,
          correo: form.email,
          telefono: form.phone
        },
        items: cartItems,
        total: orderSummary.total
      });
      setShowModal(true);

      // Pass the order ID to parent component
      if (onOrderComplete) {
        onOrderComplete(orderId);
      }

    } catch (error) {
      console.error('❌ Error:', error);
      alert('Error al procesar la orden:\n' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add handler for modal confirmation
  const handleModalConfirm = () => {
    if (completedOrderData?.id) {
      // Navigate to order details
      window.location.href = `/usuario/ordenes/${completedOrderData.id}`;
    }
  };

  return (
    <div className="checkout-page">
      {showModal && completedOrderData && ( 
        <div className="modal-overlay">
          <div className="order-modal">
            <h2>¡Gracias por tu compra, {completedOrderData.cliente.nombre}!</h2>
            <p>Tu orden #{completedOrderData.id} ha sido procesada.</p>
            <div className="modal-items">
              {completedOrderData.items.map(item => (
                <div key={item.id} className="modal-cart-item">
                  <img src={item.imageUrl} alt={item.name} 
                       onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/50x50/CCCCCC/FFFFFF?text=Img"; }}
                  />
                  <span>{item.name} (x{item.quantity})</span>
                </div>
              ))}
            </div>
            <button
              className="modal-button"
              onClick={handleModalConfirm} 
            >
              Ver Detalle de mi Orden
            </button>
          </div>
        </div>
      )}

      <div className={showModal ? 'checkout-container blurred' : 'checkout-container'}>
        <button className="back-button" onClick={onBackToCart} disabled={loading}>
          ← Volver al carrito
        </button>
        <h1>Checkout</h1>
        <div className="checkout-content">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <label>Nombre completo</label>
            <input 
              type="text" 
              name="name" 
              value={form.name} 
              onChange={handleChange}
              placeholder="Juan Pérez" 
              disabled={loading}
              className={formErrors.name ? 'error' : ''}
              minLength="2"
              required
            />
            {formErrors.name && <span className="error-message">{formErrors.name}</span>}

            <label>Correo electrónico</label>
            <input 
              type="email" 
              name="email" 
              value={form.email} 
              onChange={handleChange}
              placeholder="juan@example.com" 
              disabled={loading}
              className={formErrors.email ? 'error' : ''}
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              required
            />
            {formErrors.email && <span className="error-message">{formErrors.email}</span>}

            <label>Dirección de casa</label>
            <input 
              type="text" 
              name="address" 
              value={form.address} 
              onChange={handleChange}
              placeholder="Av. Siempre Viva 742" 
              disabled={loading}
              className={formErrors.address ? 'error' : ''}
              minLength="10"
              required
            />
            {formErrors.address && <span className="error-message">{formErrors.address}</span>}

            <label>Teléfono celular</label>
            <input 
              type="tel" 
              name="phone" 
              value={form.phone} 
              onChange={handleChange}
              placeholder="999999999" 
              disabled={loading}
              className={formErrors.phone ? 'error' : ''}
              pattern="\d{9}"
              required
            />
            {formErrors.phone && <span className="error-message">{formErrors.phone}</span>}

            <h2 className="form-section-title">Datos de Pago</h2>
            <label>Número de tarjeta</label>
            <input type="text" name="cardNumber" value={form.cardNumber} onChange={handleChange} placeholder="1234-5678-9012-3456" required />
            {formErrors.cardNumber && <span className="error-message">{formErrors.cardNumber}</span>}

            <label>Nombre del titular</label>
            <input type="text" name="cardName" value={form.cardName} onChange={handleChange} placeholder="Juan Pérez" required />
            {formErrors.cardName && <span className="error-message">{formErrors.cardName}</span>}

            <div className="form-row">
              <div>
                <label>Vencimiento (MM/AA)</label>
                <input type="text" name="expiry" value={form.expiry} onChange={handleChange} placeholder="05/25" required />
                {formErrors.expiry && <span className="error-message">{formErrors.expiry}</span>}
              </div>
              <div>
                <label>CVV</label>
                <input type="text" name="cvv" value={form.cvv} onChange={handleChange} placeholder="123" required />
                {formErrors.cvv && <span className="error-message">{formErrors.cvv}</span>}
              </div>
            </div>
            <button type="submit" className="pay-button" disabled={loading}>
              {loading ? 'Procesando...' : `Pagar S/ ${summary.total.toFixed(2)}`}
            </button>
          </form>

          <aside className="checkout-summary">
            <h2>Resumen de la Compra</h2>
            {cartItems.map(item => (
              <div key={item.id} className="summary-item">
                <span>{item.name} (x{item.quantity})</span>
                <span>S/ {(parseFloat(item.price.replace(/[^0-9.,]/g, '').replace(',', '.')) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <hr />
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>S/ {summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Envío:</span>
              <span>S/ {summary.delivery.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Descuentos:</span>
              <span>-S/ {summary.discounts.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <strong>Total:</strong>
              <strong>S/ {summary.total.toFixed(2)}</strong>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default Checkout;

