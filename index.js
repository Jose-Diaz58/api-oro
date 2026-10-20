require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const port = process.env.PORT || 4000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch(error => console.log("Error de conexión:", error));

app.listen(port, () => console.log(`API corriendo en el puerto: ${port}`));