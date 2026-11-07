const Producto = require("../models/producto.model");
const cloudinary = require("../config/cloudinary");
const streamifier = require('streamifier'); // Útil para subir desde buffer

// Función auxiliar para subir buffers a Cloudinary y forzar optimización WebP automática
const subirACloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
            { 
                folder: "grano-de-oro",
                format: "webp", // Convierte automáticamente a formato WebP ligero
                quality: "auto" // Optimiza la calidad sin perder nitidez visual
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

    // Crear producto subiendo la imagen a Cloudinary en WebP
    static crearProducto = async (req, res) => {
        try {
            let imagenUrl = "";

            if (req.file) {
                const resultado = await subirACloudinary(req.file.buffer);
                imagenUrl = resultado.secure_url; 
            } else if (req.body.imagen) {
                imagenUrl = req.body.imagen;
            }

            const nuevoProductoData = {
                ...req.body,
                variantes: req.body.variantes ? JSON.parse(req.body.variantes) : [],
                imagen: imagenUrl 
            };

            const nuevoProducto = await Producto.create(nuevoProductoData);
            res.status(201).json(nuevoProducto);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al crear el producto y subir la imagen" });
        }
    }

    // Actualizar producto, reemplazar imagen en WebP y borrar la anterior de Cloudinary
    static actualizarProducto = async (req, res) => {
        try {
            const { id } = req.params;
            const productoAnterior = await Producto.findById(id);

            if (!productoAnterior) {
                return res.status(404).send({ message: "Producto no encontrado" });
            }

            let imagenUrl = productoAnterior.imagen;

            // Si se seleccionó una nueva imagen en el archivo
            if (req.file) {
                // Subimos la nueva imagen optimizada a WebP primero
                const resultado = await subirACloudinary(req.file.buffer);
                imagenUrl = resultado.secure_url;

                // Intentamos borrar la anterior en segundo plano (si falla, no afecta al usuario)
                if (productoAnterior.imagen && productoAnterior.imagen.includes("cloudinary.com")) {
                    try {
                        const partes = productoAnterior.imagen.split('/');
                        const archivoConExt = partes[partes.length - 1];
                        const nombreArchivo = archivoConExt.substring(0, archivoConExt.lastIndexOf('.'));
                        const carpeta = partes[partes.length - 2];
                        if (nombreArchivo && carpeta) {
                            await cloudinary.uploader.destroy(`${carpeta}/${nombreArchivo}`);
                        }
                    } catch (err) {
                        console.error("Aviso: No se pudo eliminar la imagen vieja de Cloudinary", err);
                    }
                }
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
            console.error("Error detallado al actualizar:", error);
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