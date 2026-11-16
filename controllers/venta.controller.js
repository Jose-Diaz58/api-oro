const Venta = require("../models/venta.model");

const ESTADOS = ['Nuevo', 'Preparando', 'Listo', 'Entregado'];

// Devuelve el rango [inicio, fin) de un día "YYYY-MM-DD"
const Contador = require("../models/contador.model");

// Chiapas y Tabasco están en UTC-6 todo el año (México ya no usa horario de verano)
const rangoDelDia = (fecha) => {
    const inicio = new Date(`${fecha}T00:00:00-06:00`);
    const fin = new Date(inicio.getTime() + 24 * 60 * 60 * 1000);
    return { inicio, fin };
};

// 'YYYY-MM-DD' de hoy en hora de México
const hoyMX = () =>
    new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });

const siguienteFolio = async (dia) => {
    const intentar = () =>
        Contador.findOneAndUpdate(
            { _id: `folio-${dia}` },
            { $inc: { seq: 1 } },
            { returnDocument: 'after', upsert: true }
        );
    try {
        return (await intentar()).seq;
    } catch (error) {
        if (error.code === 11000) return (await intentar()).seq; // choque raro al crear el contador del día
        throw error;
    }
};
//registrarveta modificado
class VentaController {
   static registrarVenta = async (req, res) => {
    try {
        const { cliente, tipoServicio, mesa, notas, pago, productos, total } = req.body;
        const diaFolio = hoyMX();
        const folio = await siguienteFolio(diaFolio);
        const nuevaVenta = await Venta.create({
            cliente, tipoServicio, mesa, notas, pago, productos, total,
            folio, diaFolio,
        });
        res.status(200).json(nuevaVenta);
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "Error al registrar la venta" });
    }

}

    // Lista optimizada con paginación real: ?fecha=2026-10-15 (opcional) &pagina=1 &limite=20
    static listarVentas = async (req, res) => {
        try {
            const { fecha, pagina = 1, limite = 20 } = req.query;
            
            const query = {};
            if (fecha) {
                const { inicio, fin } = rangoDelDia(fecha);
                query.createdAt = { $gte: inicio, $lt: fin };
            }

            const pageNum = Math.max(parseInt(pagina), 1);
            const limitNum = Math.min(Math.max(parseInt(limite), 1), 100); // Límite seguro por página (máx 100)
            const skip = (pageNum - 1) * limitNum;

            // Consultamos en paralelo los datos y el total de documentos para la paginación
            const [ventas, total] = await Promise.all([
                Venta.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
                Venta.countDocuments(query)
            ]);

            res.status(200).json({
                ventas,
                paginacion: {
                    totalRegistros: total,
                    paginaActual: pageNum,
                    totalPaginas: Math.ceil(total / limitNum),
                    porPagina: limitNum
                }
            });
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al obtener los pedidos" });
        }
    }

    // El admin solo cambia el estado del pedido
    static actualizarEstado = async (req, res) => {
        try {
            const { estado } = req.body;
            if (!ESTADOS.includes(estado)) return res.status(400).send({ message: "Estado no válido" });
            const venta = await Venta.findByIdAndUpdate(req.params.id, { estado }, { returnDocument: 'after' });
            if (!venta) return res.status(404).send({ message: "El pedido no existe" });
            res.status(200).json(venta);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al actualizar el pedido" });
        }
    }

    static obtenerVentasPorFecha = async (req, res) => {
        try {
            const { inicio, fin } = rangoDelDia(req.query.fecha); // Ejemplo: 2026-05-08
            const ventas = await Venta.find({ createdAt: { $gte: inicio, $lt: fin } }).sort({ createdAt: -1 });
            res.status(200).json(ventas);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al obtener las ventas" });
        }
    }

    static eliminarVentasPorFecha = async (req, res) => {
        try {
            const { inicio, fin } = rangoDelDia(req.params.fecha);
            const resultado = await Venta.deleteMany({ createdAt: { $gte: inicio, $lt: fin } });
            res.status(200).json({ message: "Ventas eliminadas correctamente", resultado });
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al eliminar las ventas" });
        }
    }
    // Público: solo devuelve lo mínimo (sin nombre del cliente ni notas)
static seguimiento = async (req, res) => {
    try {
        const folio = parseInt(String(req.params.folio).replace(/\D/g, ''), 10);
        if (!folio) return res.status(400).send({ message: "Folio no válido" });

        const venta = await Venta.findOne({ diaFolio: hoyMX(), folio })
            .select('-_id folio estado tipoServicio createdAt productos.nombre productos.cantidad');
        if (!venta) return res.status(404).send({ message: "No encontramos un pedido con ese folio" });

        res.status(200).json(venta);
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: "Error al consultar el pedido" });
    }
}
}

module.exports = VentaController;