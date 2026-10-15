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
  productos: [{
    productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
    nombre: String,
    variante: String, // NUEVO: Para saber si fueron rojos, verdes, de fresa, etc.
    cantidad: Number,
    precio: Number
  }],
  total: { type: Number, required: true },
  estado: {
    type: String,
    enum: ['Nuevo', 'Preparando', 'Listo', 'Entregado'],
    default: 'Nuevo'
  }
}, { timestamps: true });

module.exports = mongoose.model('Venta', ventaSchema);