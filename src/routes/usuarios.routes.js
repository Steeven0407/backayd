import { Router } from "express";
import {postUsuarios, Postlogin, categoria,traerCategorias,editarDatos, insertarDocumento} from "../controllers/usuario.controllers.js"

const router = Router()

router.post('/login', Postlogin) //login

router.post('/usuarios',postUsuarios)//inserta un usuario administrador

router.post('/categorias',categoria )//Publica una categoria nueva

router.post('/insertarDocumento',insertarDocumento )//Publica un documento nuevo

router.get('/traerCategoria',traerCategorias )//llama a las categorias

router.put('/modificarDatos',editarDatos )//modifica los datos del admin




export default router