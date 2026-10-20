const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  // Ya no es un enum fijo: las categorías se crean desde el panel de administración
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  porcion: { type: String },
  descripcion: { type: String },
  disponible: { type: Boolean, default: true }, // Control del Toggle en el admin
  imagen: { type: String },
  variantes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);
