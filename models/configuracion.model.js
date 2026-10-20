const mongoose = require('mongoose');

// Solo existe un documento de configuración para todo el negocio
const configuracionSchema = new mongoose.Schema({
  nombre: { type: String, default: 'Grano de Oro Café Restaurant' },
  sucursal: { type: String, default: 'Sucursal Tec' },
  ubicacion: { type: String, default: '' },
  eslogan: { type: String, default: 'Café honesto, cocina con alma' },
  whatsapp: { type: String, default: '' },
  dias: { type: String, default: 'Lunes a Viernes' },
  apertura: { type: String, default: '07:00' },
  cierre: { type: String, default: '17:00' },
  ecologico: { type: Boolean, default: true },
  minutosPrep: { type: Number, default: 12, min: 5, max: 60 },
  pausado: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Configuracion', configuracionSchema);
