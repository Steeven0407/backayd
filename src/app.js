import express from 'express';
import usuariosRutas from './routes/usuarios.routes.js'
import indexRoutes from './routes/index.routes.js'


const app = express()

app.use(express.json())

app.use(indexRoutes)
app.use(usuariosRutas)

app.use((req, res ,next)=>{
    res.status(400).json({
        message: 'endpoint no encontrado'
    })
})

export default app;