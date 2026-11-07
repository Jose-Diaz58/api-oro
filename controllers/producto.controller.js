const Producto = require("../models/producto.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require('streamifier'); // Útil para subir desde buffer

// Función auxiliar para subir buffers a Cloudinary mediante stream
const subirACloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { 
                folder: "grano-de-oro",
                format: "webp", // <--- Forzar conversión a WebP automáticamente
                quality: "auto"  // <--- Optimización automática de calidad sin perder nitidez
            },
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        streamifier.createReadStream(buffer).pipe(stream);
    });
};
class ProductoController {
    
    // Obtener / buscar productos
    static obtenerDatos = async (req, res) => {
        try {
            const { q } = req.query;
            const query = q ? { nombre: { $regex: q, $options: 'i' } } : {};
            const productos = await Producto.find(query);
            res.status(200).json(productos);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al obtener los productos" });
        }
    }

    // Crear producto subiendo la imagen a Cloudinary
    static crearProducto = async (req, res) => {
        try {
            let imagenUrl = "";

            // Si el frontend mandó un archivo a través de multipart/form-data
            if (req.file) {
                const resultado = await subirACloudinary(req.file.buffer);
                imagenUrl = resultado.secure_url; // URL limpia de Cloudinary
            } else if (req.body.imagen) {
                // Si mandan una URL externa o texto plano
                imagenUrl = req.body.imagen;
            }

            const nuevoProductoData = {
                ...req.body,
                variantes: req.body.variantes ? JSON.parse(req.body.variantes) : [],
                imagen: imagenUrl // Guardamos SOLAMENTE el link en MongoDB
            };

            const nuevoProducto = await Producto.create(nuevoProductoData);
            res.status(201).json(nuevoProducto);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al crear el producto y subir la imagen" });
        }
    }

    // Actualizar producto y reemplazar la imagen en Cloudinary si se sube una nueva
    static actualizarProducto = async (req, res) => {
        try {
            const { id } = req.params;
            const productoAnterior = await Producto.findById(id);

            if (!productoAnterior) {
                return res.status(404).send({ message: "Producto no encontrado" });
            }

            let imagenUrl = productoAnterior.imagen;

            // Si se seleccionó una nueva imagen en el formulario
            if (req.file) {
                // 1. Si el producto ya tenía una imagen previa en Cloudinary, la borramos
                if (productoAnterior.imagen && productoAnterior.imagen.includes("cloudinary.com")) {
                    // Extraemos el public_id de la URL de Cloudinary
                    const partesUrl = productoAnterior.imagen.split('/');
                    const nombreConExtension = partesUrl[partesUrl.length - 1];
                    const publicIdCarpeta = partesUrl[partesUrl.length - 2]; // carpeta "grano-de-oro"
                    const publicId = `${publicIdCarpeta}/${nombreConExtension.split('.')[0]}`;
                    
                    await cloudinary.uploader.destroy(publicId).catch(err => console.error("Error al borrar imagen anterior:", err));
                }

                // 2. Subimos la nueva imagen (aprovechando también para forzar WebP si aplicaste el cambio anterior)
                const resultado = await subirACloudinary(req.file.buffer);
                imagenUrl = resultado.secure_url;
            } else if (req.body.imagen) {
                imagenUrl = req.body.imagen;
            }

            const datosActualizados = {
                ...req.body,
                ...(req.body.variantes && { variantes: JSON.parse(req.body.variantes) }),
                imagen: imagenUrl
            };

            const productoActualizado = await Producto.findByIdAndUpdate(id, datosActualizados, { returnDocument: 'after' });
            res.status(200).json(productoActualizado);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al actualizar el producto" });
        }
    }

    // Eliminar producto
    static eliminarProducto = async (req, res) => {
        try {
            const { id } = req.params;
            const productoEliminado = await Producto.findByIdAndDelete(id);

            if (!productoEliminado) {
                return res.status(404).send({ message: "Producto no encontrado" });
            }

            res.status(200).json({ message: "Producto eliminado correctamente" });
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al eliminar el producto" });
        }
    }
}

module.exports = ProductoController;