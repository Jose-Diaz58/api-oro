//Son las librerias para el servidor y validacion
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


// Importamos rutas
const ProductoRouter = require("./routes/producto.routes");
const VentaRouter = require ("./routes/venta.routes")
const MesasRouter=require("./routes/mesa.routes")
const UsuarioRouter= require("./routes/usuario.routes")
const CategoriaRouter = require("./routes/categoria.routes")
const ExtraRouter = require("./routes/extra.routes")
const ConfiguracionRouter = require("./routes/configuracion.routes")
//Variable que obtiene los valores del express
const app = express();


//configurar los http para validar a traves del cors
app.use(cors());
//usar el bodyparser para pasar el JSON
// Límite de 1 MB: las imágenes de productos llegan ya comprimidas (máx. ~150 KB) como texto base64
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));

// Aqui van las rutas
app.use("/api/", ProductoRouter);
app.use("/api", VentaRouter)
app.use("/api",MesasRouter)
app.use("/api", UsuarioRouter)
app.use("/api", CategoriaRouter)
app.use("/api", ExtraRouter)
app.use("/api", ConfiguracionRouter)

module.exports = app;