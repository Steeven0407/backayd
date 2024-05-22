import { Router } from "express";
import {deleteUsuarios, putUsuarios ,postUsuarios, Postlogin, categoria,traerCategorias} from "../controllers/usuario.controllers.js"

const router = Router()

router.post('/login', Postlogin)

router.post('/usuarios',postUsuarios )

router.post('/categorias',categoria )//Publica una categoria nueva

router.get('/traerCategoria',traerCategorias )//llama a las categorias




export default router