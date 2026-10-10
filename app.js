//Son las librerias para el servidor y validacion
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");


// Importamos rutas
const ProductoRouter = require("./routes/producto.routes");
const VentaRouter = require ("./routes/venta.routes")
const MesasRouter=require("./routes/mesa.routes")
const UsuarioRouter= require("./routes/usuario.routes")
//Variable que obtiene los valores del express
const app = express();


//configurar los http para validar a traves del cors
app.use(cors());
//usar el bodyparser para pasar el JSON
app.use(bodyParser.json());
app.use(express.json());

// Aqui van las rutas
app.use("/api/", ProductoRouter);
app.use("/api", VentaRouter)
app.use("/api",MesasRouter)
app.use("/api", UsuarioRouter)

module.exports = app;