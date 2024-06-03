import { Router } from "express";
import {postUsuarios, Postlogin, categoria,traerCategorias,editarDatos} from "../controllers/usuario.controllers.js"

const router = Router()

router.post('/login', Postlogin)

router.post('/usuarios',postUsuarios)

router.post('/categorias',categoria )//Publica una categoria nueva

router.get('/traerCategoria',traerCategorias )//llama a las categorias

router.put('/modificarDatos',editarDatos )//llama a las categorias




export default router