import { Router } from "express";
import {deleteUsuarios, putUsuarios ,postUsuarios, Postlogin, categoria} from "../controllers/usuario.controllers.js"

const router = Router()

router.post('/login', Postlogin)

router.post('/usuarios',postUsuarios )

router.post('/categorias',categoria )

router.put('/usuarios', putUsuarios)

router.delete('/usuarios', deleteUsuarios)



export default router