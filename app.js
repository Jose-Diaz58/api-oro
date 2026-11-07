const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const rateLimit = require("express-rate-limit"); // <-- 1. Importamos el rate limiter
const multer = require("multer"); // <-- Importamos multer para poder leer sus errores

// Importamos rutas
const ProductoRouter = require("./routes/producto.routes");
const VentaRouter = require("./routes/venta.routes");
const MesasRouter = require("./routes/mesa.routes");
const UsuarioRouter = require("./routes/usuario.routes");
const CategoriaRouter = require("./routes/categoria.routes");
const ExtraRouter = require("./routes/extra.routes");
const ConfiguracionRouter = require("./routes/configuracion.routes");

const app = express();

app.use(cors());
app.use(compression());

// <-- 2. Configuramos el límite de peticiones (ej: máx. 300 peticiones cada 15 minutos por IP)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 300, // Límite de peticiones por IP
    standardHeaders: true, // Retorna info de límite en las cabeceras `RateLimit-*`
    legacyHeaders: false, // Desactiva las cabeceras `X-RateLimit-*`
    message: { message: "Demasiadas peticiones desde esta IP, por favor intenta más tarde." }
});

// Aplicamos el limitador a todas las rutas que empiezan con /api/
app.use("/api/", limiter);

app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

// Rutas
app.use("/api/", ProductoRouter);
app.use("/api", VentaRouter);
app.use("/api", MesasRouter);
app.use("/api", UsuarioRouter);
app.use("/api", CategoriaRouter);
app.use("/api", ExtraRouter);
app.use("/api", ConfiguracionRouter);

// <-- 3. MIDDLEWARE GLOBAL DE ERRORES (Debe ir siempre DESPUÉS de las rutas) -->
app.use((err, req, res, next) => {
    // Si el error es de Multer y es por exceder el límite de peso
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
            message: "La imagen es muy pesada. Por favor, sube una foto más ligera." 
        });
    }
    
    // Si es cualquier otro error interno de Multer
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: "Error al subir la imagen: " + err.message });
    }

    // Para cualquier otro error genérico en el servidor
    console.error(err);
    res.status(500).json({ message: "Error interno del servidor" });
});

module.exports = app;