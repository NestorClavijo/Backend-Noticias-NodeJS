// app.js
import express from 'express'
import 'dotenv/config'
import dbClient from './config/dbClient.js'
import usuariosRoutes from './routes/usuarios.js'
import comunidadRoutes from './routes/comunidad.js'
import noticiasRoutes from './routes/noticia.js'

async function main() {
  try {
    // 1 Conecta a MongoDB y espera a que termine
    await dbClient.connectDB()
    console.log('Base de datos conectada')
  } catch (err) {
    console.error('No se pudo conectar a la BD:', err)
    process.exit(1)
  }

  // 2 Crea la instancia de Express
  const app = express()

  // 3 Middlewares
  app.use(express.json())                       // para parsear JSON bodies
  app.use(express.urlencoded({ extended: true })) // si necesitas forms urlencoded

  // 4 Rutas
  app.use('/usuarios', usuariosRoutes)
  app.use('/comunidades', comunidadRoutes)
  app.use('/noticias', noticiasRoutes)

  // 5 Arranca el servidor
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`)
  })
}

main()
