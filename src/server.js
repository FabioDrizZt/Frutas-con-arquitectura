const express = require('express')
const app = express()
const frutasRoutes = require('./routes/frutasRoutes.js')
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use((req, res, next) => {
  res.header('Content-Type', 'application/json charset=utf-8')
  next()
})
app.get('/', (req, res) => { res.status(200).end('¡Bienvenido a la API de frutas!') })

// Agregamos el enrutador de frutas
app.use('/frutas', frutasRoutes)

app.listen(PORT, () => console.log(`API de frutas escuchando en http://localhost:${PORT}`))
