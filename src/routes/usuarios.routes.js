import { Router } from "express";
import {postUsuarios, Postlogin,editarDatos,
    editarContrasena,filtrarDocumentos} from "../controllers/usuario.controllers.js"
import {generarInforme} from "../controllers/pdf.controllers.js"
import{categoria,editarCategoria,editarDocumento,
    eliminarDocumento,insertarDocumento,traerCategorias} from "../controllers/documento.controllers.js"
import {incrementarVisitas} from "../controllers/index.controller.js"
    const router = Router()

router.post('/login', Postlogin) //login

router.post('/usuarios',postUsuarios)//inserta un usuario administrador

router.post('/categorias',categoria )//Publica una categoria nueva

router.post('/insertarDocumento',insertarDocumento )//Publica un documento nuevo

router.get('/traerCategoria',traerCategorias )//llama a las categorias

router.get('/informe',generarInforme )//llama a las categorias

router.put('/modificarDatos',editarDatos )//modifica los datos del admin

router.put('/editarContrasena',editarContrasena )//modifica la contraseña del admin

router.put('/editarDocumento',editarDocumento )//edita un documento

router.put('/editarCategoria',editarCategoria )//edita una categoria

router.delete('/eliminarDocumento',eliminarDocumento)//elimina un documento

router.post('/filtrarDocumentos',filtrarDocumentos )//filtra documentos segun la busqueda

router.put('/vistas',incrementarVisitas )//incrementa las vistas





export default router