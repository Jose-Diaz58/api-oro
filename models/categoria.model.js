const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true },
  visible: { type: Boolean, default: true },
  orden: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Categoria', categoriaSchema);
