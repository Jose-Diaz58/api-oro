const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  cliente: { type: String, required: true },
  tipoServicio: { 
    type: String, 
    required: true,
    enum: ['Comer Aquí', 'Para Llevar']
  },
  mesa: { type: String },
  notas: { type: String },
  pago: { type: String, enum: ['Efectivo', 'Tarjeta'], default: 'Efectivo' },
  productos: [{
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    nombre: String,
    variante: String, // Para saber si fueron rojos, verdes, de fresa, etc.
    extras: [{ nombre: String, precio: Number }], // Extras globales elegidos por el cliente
    cantidad: Number,
    precio: Number // Precio unitario, ya incluye los extras
  }],
  total: { type: Number, required: true },
  estado: {
    type: String,
    enum: ['Nuevo', 'Preparando', 'Listo', 'Entregado'],
    default: 'Nuevo'
  }
}, { timestamps: true });

module.exports = mongoose.model('Venta', ventaSchema);
