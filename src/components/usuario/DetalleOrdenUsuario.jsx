import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import './DetalleOrdenUsuario.css';

function DetalleOrdenUsuario({ getOrderById, updateOrderStatus }) {
  const { orderId } = useParams();
  const [orden, setOrden] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setCargando(true);
        console.log('🔍 Buscando orden:', orderId);
        
        const response = await fetch(`http://localhost:3001/api/orders/${encodeURIComponent(orderId)}`, {
          headers: {
            'Accept': 'application/json'
          }
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error al cargar la orden');
        }

        if (data.success && data.order) {
          const transformedOrder = {
            id: data.order.id,
            fecha: new Date(data.order.createdAt).toLocaleDateString('es-ES'),
            estado: data.order.status,
            cliente: {
              nombre: data.order.clientName,
              correo: data.order.clientEmail,
              telefono: data.order.clientPhone
            },
            direccionEnvio: data.order.shippingAddress,
            items: data.order.items.map(item => ({
              id: item.productId,
              nombre: item.product?.name || 'Producto no disponible',
              imageUrl: item.product?.image_url || '',
              presentacion: item.product?.presentation || 'N/A',
              cantidad: item.quantity,
              precioUnitario: item.unitPrice,
              precioTotalItem: item.totalPrice
            })),
            metodoPago: data.order.paymentMethod,
            resumenCosto: {
              subtotal: parseFloat(data.order.totalAmount) - 10,
              envio: 10.00,
              descuentos: 0.00,
              totalGeneral: parseFloat(data.order.totalAmount)
            }
          };

          console.log('✅ Orden transformada:', transformedOrder);
          setOrden(transformedOrder);
          setError(null);
        } else {
          throw new Error('No se pudo cargar la orden');
        }

      } catch (error) {
        console.error('❌ Error al cargar la orden:', error);
        setError('Error al cargar la orden: ' + error.message);
        setOrden(null);
      } finally {
        setCargando(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Show loading state
  if (cargando) {
    return (
      <div className="detalle-orden-container loading-container">
        <p>Cargando detalles de la orden...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="detalle-orden-container error-container">
        <p>{error}</p>
        <Link to="/usuario/ordenes" className="button-secondary">
          ← Volver a Mis Órdenes
        </Link>
      </div>
    );
  }

  // Show empty state
  if (!orden) {
    return (
      <div className="detalle-orden-container error-container">
        <p>No se encontró la orden solicitada</p>
        <Link to="/usuario/ordenes" className="button-secondary">
          ← Volver a Mis Órdenes
        </Link>
      </div>
    );
  }

  const handleCancelarOrden = async () => {
    if (orden && orden.estado === 'Procesando') {
      if (window.confirm('¿Estás seguro de que deseas cancelar esta orden?')) {
        try {
          // Try API first
          const response = await fetch(`http://localhost:3001/api/orders/${orden.id}/cancel`, {
            method: 'PUT'
          });
          const data = await response.json();
          
          if (data.success) {
            setOrden(prev => ({...prev, estado: 'Cancelado'}));
            // Update parent state
            updateOrderStatus(orden.id, 'Cancelado');
          } else {
            // If API fails, update local state only
            setOrden(prev => ({...prev, estado: 'Cancelado'}));
            updateOrderStatus(orden.id, 'Cancelado');
          }
        } catch (error) {
          // If API fails, update local state only
          setOrden(prev => ({...prev, estado: 'Cancelado'}));
          updateOrderStatus(orden.id, 'Cancelado');
        }
      }
    }
  };

  const sePuedeCancelar = orden.estado === 'Procesando';

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'procesando': return 'active procesando';
      case 'preparando': return 'active preparando';
      case 'enviado': return 'active enviado';
      case 'entregado': return 'active entregado';
      case 'cancelado': return 'canceled';
      default: return '';
    }
  };

  const renderItemImage = (imageUrl, nombre) => {
    return (
      <img
        src={imageUrl || "https://placehold.co/80x80/CCCCCC/FFFFFF?text=Img"}
        alt={nombre}
        className="item-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://placehold.co/80x80/CCCCCC/FFFFFF?text=Img";
        }}
      />
    );
  };

  return (
    <div className="detalle-orden-page">
      <div className="detalle-orden-container">
        <div className="detalle-orden-header">
          <h1 className="main-title">Detalle de la Orden: #{orden.id}</h1>
          <Link to="/usuario/ordenes" className="button-secondary">
            ← Volver a Mis Órdenes
          </Link>
        </div>

        <section className="orden-info-section">
          <div className="info-block">
            <h2 className="section-title">Información General</h2>
            <p><strong>ID de Orden:</strong> {orden.id}</p>
            <p><strong>Fecha de Pedido:</strong> {orden.fecha}</p>
            <p><strong>Estado:</strong> <span className={`status-badge status-${orden.estado.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')}`}>{orden.estado}</span></p>
          </div>
          <div className="info-block">
            <h2 className="section-title">Cliente</h2>
            <p><strong>Nombre:</strong> {orden.cliente.nombre}</p>
            <p><strong>Correo:</strong> {orden.cliente.correo}</p>
            <p><strong>Teléfono:</strong> {orden.cliente.telefono}</p>
          </div>
        </section>

        <section className="orden-direccion-section">
          <h2 className="section-title">Dirección de Envío</h2>
          <p>{orden.direccionEnvio.calle}, {orden.direccionEnvio.distrito}</p>
          <p>{orden.direccionEnvio.ciudad}, {orden.direccionEnvio.pais}</p>
          {orden.direccionEnvio.referencia && <p><em>Referencia: {orden.direccionEnvio.referencia}</em></p>}
        </section>

        <section className="orden-items-section">
          <h2 className="section-title">Artículos en la Orden ({orden.items.reduce((acc, item) => acc + item.cantidad, 0)} productos)</h2>
          <div className="items-list">
            {orden.items.map(item => (
              <div key={`${item.id}-${item.nombre}`} className="orden-item-card">
                {renderItemImage(item.imageUrl, item.nombre)}
                <div className="item-details">
                  <h3 className="item-name">{item.nombre}</h3>
                  <p className="item-presentation">
                    Presentación: {item.presentacion}
                  </p>
                  <p className="item-price-quantity">
                    {item.cantidad} x S/ {item.precioUnitario.toFixed(2)}
                  </p>
                </div>
                <div className="item-total-price">
                  S/ {item.precioTotalItem.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="orden-pago-section">
          <h2 className="section-title">Información de Pago</h2>
          <p><strong>Método de Pago:</strong> {orden.metodoPago}</p>
          {orden.notasPedido && (
            <>
              <h3 className="subsection-title">Notas Adicionales del Pedido:</h3>
              <p className="notas-pedido-text">{orden.notasPedido}</p>
            </>
          )}
        </section>

        <section className="orden-resumen-costo-section">
          <h2 className="section-title">Resumen del Costo</h2>
          <div className="costo-grid">
            <span>Subtotal:</span><span>S/ {orden.resumenCosto.subtotal.toFixed(2)}</span>
            <span>Costo de Envío:</span><span>S/ {orden.resumenCosto.envio.toFixed(2)}</span>
            <span>Descuentos:</span><span className="descuento-valor">- S/ {orden.resumenCosto.descuentos.toFixed(2)}</span>
            <strong className="total-label">Total General:</strong><strong className="total-valor">S/ {orden.resumenCosto.totalGeneral.toFixed(2)}</strong>
          </div>
        </section>
        
        <section className="orden-resumen-costo-section">
          <h2 className="section-title">Estado del Pedido</h2>
          <div className="estado-pedido-container">
            <div className={`estado-pedido ${orden.estado === 'Preparando' ? 'active' : ''} 
                            ${orden.estado === 'Procesando' ? 'current' : ''}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                width="1em"
                height="1em"
                style={{scale: '1', width: '5em', height: '5em'}}
              >
                <path
                  fill="currentColor"
                  d="M21.5 11v-1a1 1 0 0 0-.962.725zm5.5 0h1a1 1 0 0 0-.106-.447zM5 11l-.894-.447A1 1 0 0 0 4 11zm5.5 0l.961-.275A1 1 0 0 0 10.5 10zM5 19H4a1 1 0 0 0 1 1zm22 0v1a1 1 0 0 0 1-1zM8 5V4a1 1 0 0 0-.894.553zm16 0l.894-.447A1 1 0 0 0 24 4zm2 9.5a1 1 0 1 0 2 0zM4 14a1 1 0 1 0 2 0zm0-1v11h2V13zm0 11c0 1.075.528 2.067 1.23 2.77C5.933 27.473 6.925 28 8 28v-2c-.425 0-.933-.223-1.355-.645C6.222 24.933 6 24.425 6 24zm4 4h16v-2H8zm16 0c1.075 0 2.067-.527 2.77-1.23S28 25.075 28 24h-2c0 .425-.223.933-.645 1.355S24.425 26 24 26zm4-4V13h-2v11zm-12-8.5c2.547 0 4.182-1.005 5.17-2.07c.484-.52.8-1.041.998-1.436a5 5 0 0 0 .285-.691l.007-.023v-.003l.001-.001L21.5 11a87 87 0 0 1-.961-.276v-.003l.001-.002v-.002l-.002.01l-.025.07a3 3 0 0 1-.134.303c-.13.261-.346.616-.674.97c-.637.685-1.752 1.43-3.705 1.43zm5.5-3.5H27v-2h-5.5zM5 12h5.5v-2H5zm5.5-1a78 78 0 0 0-.961.276v.004l.003.006l.02.066q.019.058.054.152c.047.124.117.292.216.49a6.2 6.2 0 0 0 .998 1.437c.988 1.064 2.623 2.069 5.17 2.069v-2c-1.953 0-3.068-.745-3.705-1.43a4.2 4.2 0 0 1-.674-.97a3 3 0 0 1-.162-.383v.002l.001.002v.002l.001.001zM16 21.5c-2.236 0-3.323-.768-3.866-1.4a3.1 3.1 0 0 1-.543-.91a2.4 2.4 0 0 1-.102-.338v-.006v.011s0 .002-.989.143a69 69 0 0 0-.99.144v.004l.002.007l.012.071q.012.064.036.162c.032.131.083.308.162.515c.157.413.43.956.894 1.498c.957 1.117 2.62 2.099 5.384 2.099zM10.5 18H5v2h5.5zM27 18h-5.5v2H27zm-5.5 1a76 76 0 0 1-.99-.144v-.002l.001-.004v-.004v.006l-.014.06c-.014.06-.042.158-.088.279a3.1 3.1 0 0 1-.543.908c-.543.633-1.63 1.401-3.866 1.401v2c2.764 0 4.427-.982 5.384-2.1a5.1 5.1 0 0 0 .894-1.497a4.4 4.4 0 0 0 .207-.73l.003-.018l.001-.008v-.004s.001-.002-.989-.143m4.5-8v8h2v-8zM6 19v-8H4v8zM8 6h16V4H8zm15.106-.553l3 6l1.788-.894l-3-6zM26 11v3.5h2V11zM7.106 4.553l-3 6l1.788.894l3-6zM4 11v3h2v-3zm6.5 9h11v-2h-11z"
                ></path>
              </svg>
              <span>Preparando</span>
            </div>
            <div className={`estado-pedido ${orden.estado === 'Enviado' ? 'active' : ''}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                style={{scale: '1', width: '5em', height: '5em'}}
              >
                <path
                  fill="currentColor"
                  d="M19.44 9.03L17.31 6.9l-1.6-1.6c-.19-.19-.45-.3-.71-.3h-3c-.55 0-1 .45-1 1s.45 1 1 1h2.59l2 2H5c-2.8 0-5 2.2-5 5s2.2 5 5 5c2.46 0 4.45-1.69 4.9-4h.82c.53 0 1.04-.21 1.41-.59l2.18-2.18c-.2.54-.31 1.14-.31 1.77c0 2.8 2.2 5 5 5s5-2.2 5-5c0-2.65-1.97-4.77-4.56-4.97M5 15h2.82C7.4 16.15 6.28 17 5 17c-1.63 0-3-1.37-3-3s1.37-3 3-3c1.28 0 2.4.85 2.82 2H5c-.55 0-1 .45-1 1s.45 1 1 1m14 2c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3"
                ></path>
              </svg>
              <span>Enviado</span>
            </div>
            <div className={`estado-pedido ${orden.estado === 'Entregado' ? 'active' : ''}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="1em"
                height="1em"
                style={{scale: '1', width: '5em', height: '5em'}}
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  color="currentColor"
                >
                  <path d="M21 7v5M3 7v10.161c0 1.383 1.946 2.205 5.837 3.848C10.4 21.67 11.182 22 12 22V11.355M15 19s.875 0 1.75 2c0 0 2.78-5 5.25-6"></path>
                  <path d="M8.326 9.691L5.405 8.278C3.802 7.502 3 7.114 3 6.5s.802-1.002 2.405-1.778l2.92-1.413C10.13 2.436 11.03 2 12 2s1.871.436 3.674 1.309l2.921 1.413C20.198 5.498 21 5.886 21 6.5s-.802 1.002-2.405 1.778l-2.92 1.413C13.87 10.564 12.97 11 12 11s-1.871-.436-3.674-1.309M6 12l2 1m9-9L7 9"></path>
                </g>
              </svg>
              <span>Entregado</span>
            </div>
          </div>
        </section>

        <div className="orden-acciones">
          {sePuedeCancelar && (
            <button onClick={handleCancelarOrden} className="button-danger cancel-button">
              Cancelar Orden
            </button>
          )}
          {!sePuedeCancelar && orden.estado !== 'Cancelado' && orden.estado !== 'Cancelado (Pendiente)' && (
            <p className="info-cancelacion">Esta orden ya no puede ser cancelada.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DetalleOrdenUsuario;
