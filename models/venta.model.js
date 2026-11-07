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
    variante: String,
    extras: [{ nombre: String, precio: Number }],
    cantidad: Number,
    precio: Number 
  }],
  total: { type: Number, required: true },
  estado: {
    type: String,
    enum: ['Nuevo', 'Preparando', 'Listo', 'Entregado'],
    default: 'Nuevo',
    index: true // Indexado para agilizar filtros de estado en cocina/admin
  }
}, { timestamps: true });

// Índice compuesto para acelerar las consultas por rangos de fecha (muy usado en reportes y listados diarios)
ventaSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Venta', ventaSchema);