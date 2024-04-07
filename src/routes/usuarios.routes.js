import { Router } from "express";
import {deleteUsuarios, putUsuarios ,postUsuarios, Postlogin} from "../controllers/usuario.controllers.js"

const router = Router()

router.post('/login', Postlogin)

router.post('/usuarios',postUsuarios )

router.put('/usuarios', putUsuarios)

router.delete('/usuarios', deleteUsuarios)



export default router