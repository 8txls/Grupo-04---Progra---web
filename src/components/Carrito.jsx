
import React, { useState, useEffect } from 'react';
import './Carrito.css'; // Importe de los estilos de carrito 

function Carrito({ cartItems, onBack, onQuantityChange, onRemoveItem, onCheckout }) {
  
  const [selectedIds, setSelectedIds] = useState([]);

  
  useEffect(() => {
    setSelectedIds(cartItems.map(item => item.id));
  }, [cartItems]);

  
  const toggleSelect = id => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  
  const handleMinus = (id, quantity) => {
    if (quantity > 1) {
      onQuantityChange(id, -1);
    } else {
      onRemoveItem(id);
    }
  };

  
  const allItemsCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const selectedItems = cartItems.filter(item => selectedIds.includes(item.id));
  const selectedItemsCount = selectedItems.reduce((s, i) => s + i.quantity, 0);
  const subtotalSelected = selectedItems.reduce((s, i) => {
    const num = parseFloat(
      i.price.replace(/[^0-9.,]/g, '').replace(',', '.')
    );
    return s + num * i.quantity;
  }, 0);
  const delivery = 0;
  const discounts = 0;
  const totalSelected = subtotalSelected + delivery - discounts;

  return (
    <div className="carrito-container">
      <div className="carrito-header">
        <h1>Carro ({allItemsCount} productos)</h1>
        <button className="back-button" onClick={onBack}>← Volver</button>
      </div>

      <div className="carrito-content container">
        <section className="cart-items">
          {cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleSelect(item.id)}
                />
              </div>
              <img src={item.imageUrl} alt={item.name} />

              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="presentation">Presentación: {item.category}</p>
                <p className="arrival">Llega mañana</p>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  width: '20%'
                }}
              >
                <div className="price">{item.price}</div>
                <div className="quantity-control">
                  <button onClick={() => handleMinus(item.id, item.quantity)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onQuantityChange(item.id, 1)}>+</button>
                </div>
              </div>
            </div>
          ))}
        </section>

        <aside className="cart-summary">
          <h2>Resumen de la compra</h2>
          <div className="summary-row">
            <span>Productos ({selectedItemsCount})</span>
            <span>S/ {subtotalSelected.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>GRATIS</span>
          </div>
          <div className="summary-row">
            <span>Descuentos</span>
            <span>-S/ {discounts.toFixed(2)}</span>
          </div>
          <hr />
          <div className="summary-row total">
            <span>Total</span>
            <span>S/ {totalSelected.toFixed(2)}</span>
          </div>
          <button
            className="checkout-button"
            onClick={onCheckout}
          >
            Continuar compra
          </button>
        </aside>
      </div>
    </div>
  );
}

export default Carrito;
