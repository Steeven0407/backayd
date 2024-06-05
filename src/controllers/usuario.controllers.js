import { pool } from "../db.js";
import databaseError from "../middlewares/error.js";
//Login
export const Postlogin = async (req, res) => {
  const connection = await pool.getConnection();

  let autenticado = false;
  let codigo;
  let correo;
  let nombre;
  let fotoPerfil;
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
      codigo = results[0][0].codigo;
      fotoPerfil = results[0][0].fotoPerfil;
      console.log("Autenticación exitosa");
      //borrable a futuro el isadmin

      res.status(200).json({
        autenticado: autenticado, nombre: nombre,
        correo: correo, codigo: codigo, fotoPerfil: fotoPerfil
      })

    } else {
      // Las credenciales son incorrectas
      console.log("Credenciales incorrectas");
      res.status(401).json({ message: "Credenciales incorrectas", autenticado: autenticado });

    }

  } catch (error) {
    console.error('Error de consulta:', error);

    const dbError = new databaseError(
      "Error interno del servidor al realizar la consulta",
      error.code || error.errno
    );
    return res.status(500).json({ message: dbError.message });
  }
};
//Insertar usuario administrador
export const postUsuarios = async (req, res) => {
  try {
    const { codigo, correo, nombre } = req.body
    const [rows] = await pool.query('INSERT INTO administrador (codigo,correo,contrasena,nombre) VALUES (?,?,?,?)',
      [codigo, correo, codigo, nombre])
    res.send("Usuario insertado" + {
      id: rows.insertId,
      nombre,
      codigo
    })
  } catch (error) {
    console.error('Error al subir usuarios:', error);

    // Aquí capturamos el error específico de clave duplicada.
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      const dbError = new databaseError(
        "El código de usuario ya existe en la base de datos.",
        error.code || error.errno
      );
      return res.status(409).json({ message: dbError.message });
    }

    // Manejo genérico de otros errores de base de datos
    const dbError = new databaseError(
      "Error interno del servidor al realizar la consulta",
      error.code || error.errno
    );
    return res.status(500).json({ message: dbError.message });
  }
};
//Insertar Tipo de documento
export const categoria = async (req, res) => {
  try {
    const { id, nombre, descripcion } = req.body;

    // Verificar si el nombre ya existe
    const [existingRows] = await pool.query('SELECT id FROM tipodocumento WHERE nombre = ?', [nombre]);
    if (existingRows.length > 0) {
      return res.status(409).json({ message: 'El nombre de la categoria ya existe en la base de datos.' });
    }

    // Si no existe, proceder con la inserción
    const [rows] = await pool.query('INSERT INTO tipodocumento (id, nombre, descripcion) VALUES (?, ?, ?)',
      [id, nombre, descripcion]);
    res.send({
      message: "Categoria insertada",
      id: rows.insertId,
      id,
      nombre
    });
  } catch (error) {
    console.error('Error al subir categorias:', error);

    // Manejo genérico de errores de base de datos
    const dbError = new Error('Error interno del servidor al realizar la consulta');
    return res.status(500).json({ message: dbError.message });
  }
};
//Traer todas las categorias
export const traerCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tipodocumento");
    res.json({ message: "Categorías encontradas", data: rows });
  } catch (error) {
    console.error("Error al traer las categorías:", error);

    // Manejo genérico de otros errores de base de datos
    const dbError = new databaseError(
      "Error interno del servidor al realizar la consulta",
      error.code || error.errno
    );
    return res.status(500).json({ message: dbError.message });
  }
};
//Modificar Datos del administrador
export const editarDatos = async (req, res) => {
  const codigo = req.body.codigo;
  let correo = req.body.correo;
  let fotoPerfil = req.body.fotoPerfil;
  let nombre = req.body.nombre;
  console.log(req.body);
  if (fotoPerfil == "") {
    fotoPerfil = null;
  }
  if (nombre == "") {
    nombre = null;
  }
  if (correo == "") {
    correo = null;
  }
  try {
    // Consulta de actualización
    const [updateResult] = await pool.query(
      'UPDATE administrador SET nombre = IFNULL(?, nombre), correo = IFNULL(?, correo), fotoPerfil = IFNULL(?, fotoPerfil) WHERE codigo = ?',
      [nombre, correo, fotoPerfil, codigo]
    );

    // Consulta para obtener los datos actualizados
    const [datos] = await pool.query('SELECT * FROM administrador WHERE codigo = ?', [codigo]);

    if (datos.length >= 1) {
      // Datos nuevos que actualiza el usuario
      nombre = datos[0].nombre;
      correo = datos[0].correo;
      fotoPerfil = datos[0].fotoPerfil;
    }

    res.status(200).json({ nombre, correo, fotoPerfil });
  } catch (error) {
    console.error('Error al actualizar los datos:', error);

    // Aquí capturamos el error específico de clave duplicada.
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      const dbError = new Error('El código de usuario ya existe en la base de datos.');
      return res.status(409).json({ message: dbError.message });
    }

    // Manejo genérico de otros errores de base de datos
    const dbError = new Error('Error interno del servidor al realizar la consulta');
    return res.status(500).json({ message: dbError.message });
  }
};

export const insertarDocumento = async (req, res) => {
  // const connection = await pool.getConnection();
  
  let fechaDeHoy = new Date();
  let año = fechaDeHoy.getFullYear().toString();
  let dia = ('0' + fechaDeHoy.getDate()).slice(-2); // Agrega cero delante si es necesario
  let mes = ('0' + (fechaDeHoy.getMonth() + 1)).slice(-2); // Agrega cero delante si es necesario
  

  let usuariosubida = req.body.usuariosubida;//el codigo del administrador
  let tipodocumento = req.body.tipodocumento;//el codigo del tipo de documento
  let descripcion = req.body.descripcion;
  let miembros = req.body.miembros;
  let archivos = req.body.archivos;
  let estado = req.body.estado;//0 inactivo 1 activo
  let fechasubida = `${año}-${mes}-${dia}`;
  console.log(req.body);
  try {
    // Consulta de actualización
    const [resultsubida] = await pool.query(
      'INSERT INTO documento (usuariosubida,tipodocumento,descripcion,miembros,archivos,estado,fechasubida) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [usuariosubida,tipodocumento, descripcion, miembros,archivos,estado,fechasubida]
    );

  

    res.status(200).json({usuariosubida,tipodocumento, descripcion, miembros,archivos,estado,fechasubida});
  } catch (error) {
    console.error('Error al actualizar los datos:', error);

    // Aquí capturamos el error específico de clave duplicada.
    if (error.code === "ER_DUP_ENTRY" || error.errno === 1062) {
      const dbError = new Error('El código de usuario ya existe en la base de datos.');
      return res.status(409).json({ message: dbError.message });
    }

    // Manejo genérico de otros errores de base de datos
    const dbError = new Error('Error interno del servidor al realizar la consulta');
    return res.status(500).json({ message: dbError.message });
  }
};

export const editarContrasena = async (req, res) => {
  let contrasena = req.body.contrasena;
  const codigo = req.body.codigo;
  
  console.log(req.body);
  try {
    // Consulta de actualización
    const [updateResult] = await pool.query(
      'UPDATE administrador SET contrasena = IFNULL(?, contrasena) WHERE codigo = ?',
      [contrasena,codigo]
    );

    res.status(200).json({ rta: "contraseña actualizada" });
  } catch (error) {
    console.error('Error al actualizar los datos:', error);

    // Manejo genérico de otros errores de base de datos
    const dbError = new Error('Error interno del servidor al realizar la consulta');
    return res.status(500).json({ message: dbError.message });
  }
};