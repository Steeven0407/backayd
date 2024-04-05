import { Router } from "express";
import {deleteUsuarios, putUsuarios ,postUsuarios, getlogin} from "../controllers/usuario.controllers.js"

const router = Router()

router.get('/login', getlogin)

router.post('/usuarios',postUsuarios )

router.put('/usuarios', putUsuarios)

router.delete('/usuarios', deleteUsuarios)



export default router