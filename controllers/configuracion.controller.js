const Configuracion = require("../models/configuracion.model");

// Solo estos campos se pueden guardar (evita que entren _id, __v, etc.)
const CAMPOS = ['nombre', 'sucursal', 'ubicacion', 'eslogan', 'whatsapp', 'dias',
    'apertura', 'cierre', 'ecologico', 'minutosPrep', 'pausado'];

class ConfiguracionController {
    static obtener = async (req, res) => {
        try {
            const config = (await Configuracion.findOne()) ?? (await Configuracion.create({}));
            res.status(200).json(config);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al obtener la configuración" });
        }
    }

    static actualizar = async (req, res) => {
        try {
            const cambios = {};
            for (const campo of CAMPOS) {
                if (req.body[campo] !== undefined) cambios[campo] = req.body[campo];
            }
            const config = await Configuracion.findOneAndUpdate({}, cambios, {
                upsert: true,
                returnDocument: 'after',
                setDefaultsOnInsert: true,
                runValidators: true
            });
            res.status(200).json(config);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al guardar la configuración" });
        }
    }
}

module.exports = ConfiguracionController;
