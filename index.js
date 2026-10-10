const mongoose = require("mongoose");
const app = require ("./app");
const port = process.env.PORT || 4000;

const URI_NUBE = 'mongodb://localhost:27017/granodeoro';

mongoose.connect(URI_NUBE)
.then(() => console.log("¡Conectado a MongoDB local! "))
.catch(error => console.log("Error de conexión:", error));

app.listen(port, ()=>{
    console.log("********************************")
    console.log("****En efecto, se ejecuta*******")
    console.log("********************************")
    console.log(`API corriendo en el puerto: ${port}`)
})