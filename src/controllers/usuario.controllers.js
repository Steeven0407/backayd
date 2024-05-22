import { pool } from '../db.js'
import databaseError from '../middlewares/error.js'

export const Postlogin = async (req, res) => {
    const connection = await pool.getConnection();

    let isadmin = false;
    let autenticado = false;
    let codigo;
    let correo;
    let tipo;
    let nombre;
    console.log(req.body)
    try {
        const code = req.body.codigo;
        const user = req.body.correo;
        const pass = req.body.contrasena;


        const results = await connection.query('SELECT * FROM administrador WHERE codigo = ? AND correo = ? AND contrasena = ?', [code, user, pass])
        console.log(results[0][0])



        if (results[0].length >= 1) {
            // El usuario se autenticó correctamente
            autenticado = true;
            nombre = results[0][0].nombre;
            correo = results[0][0].correo;
            tipo = results[0][0].tipo;
            codigo = results[0][0].codigo;
            console.log("Autenticación exitosa");
            //borrable a futuro el isadmin
            if (results[0][0].tipo == 0) {
                isadmin = true;
                console.log("es admin");
            }
            res.status(200).json({
                isadmin: isadmin, autenticado: autenticado, nombre: nombre,
                correo: correo, codigo: codigo, nombre: nombre, tipo: tipo
            })

        } else {
            // Las credenciales son incorrectas
            console.log("Credenciales incorrectas");
            res.status(401).json({ message: "Credenciales incorrectas", autenticado: autenticado });

        }

    } catch (error) {
        console.error('Error de consulta:', error);

        const dbError = new databaseError('Error interno del servidor al realizar la consulta', error.code || error.errno);
        return res.status(500).json({ message: dbError.message });
    }
}


export const postUsuarios = async (req, res) => {
    try {
        const { codigo, correo, tipo, nombre } = req.body
        const [rows] = await pool.query('INSERT INTO administrador (codigo,correo,contrasena,tipo,nombre) VALUES (?,?,?,?,?)',
            [codigo, correo, codigo, tipo, nombre])
        res.send("Usuario insertado" + {
            id: rows.insertId,
            nombre,
            codigo
        })
    } catch (error) {
        console.error('Error al subir usuarios:', error);

        // Aquí capturamos el error específico de clave duplicada.
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            const dbError = new databaseError('El código de usuario ya existe en la base de datos.', error.code || error.errno);
            return res.status(409).json({ message: dbError.message });
        }

        // Manejo genérico de otros errores de base de datos
        const dbError = new databaseError('Error interno del servidor al realizar la consulta', error.code || error.errno);
        return res.status(500).json({ message: dbError.message });

    }
}

export const categoria = async (req, res) => {
    try {
        const { id,nombre,descripcion } = req.body
        const [rows] = await pool.query('INSERT INTO tipodocumento (id,nombre,descripcion) VALUES (?,?,?)',
            [id,nombre,descripcion])
        res.send("categoria insertada" + {
            id: rows.insertId,
            id,
            nombre
        })
    } catch (error) {
        console.error('Error al subir categorias:', error);

        // Aquí capturamos el error específico de clave duplicada.
        if (error.code === 'ER_DUP_ENTRY' || error.errno === 1062) {
            const dbError = new databaseError('El código de categoria ya existe en la base de datos.', error.code || error.errno);
            return res.status(409).json({ message: dbError.message });
        }

        // Manejo genérico de otros errores de base de datos
        const dbError = new databaseError('Error interno del servidor al realizar la consulta', error.code || error.errno);
        return res.status(500).json({ message: dbError.message });

    }
}


export const traerCategorias = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM tipodocumento');
        res.json({ message: 'Categorías encontradas', data: rows });
    } catch (error) {
        console.error('Error al traer las categorías:', error);

        // Manejo genérico de otros errores de base de datos
        const dbError = new databaseError('Error interno del servidor al realizar la consulta', error.code || error.errno);
        return res.status(500).json({ message: dbError.message });
    }
}


export const putUsuarios = (req, res) => res.send('actualizando usuarios')

export const deleteUsuarios = (req, res) => res.send('eliminando usuarios')