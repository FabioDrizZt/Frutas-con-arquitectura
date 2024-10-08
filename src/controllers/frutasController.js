const { connectToMongoDB, disconnectFromMongoDB } = require('../config/mongodb')

const getAllFrutas = async (req, res) => {
  const client = await connectToMongoDB()
  if (!client) {
    res.status(500).send('Error al conectarse a MongoDB')
    return
  }

  const db = client.db('frutasDB')
  const frutas = await db.collection('frutas').find().toArray()
  await disconnectFromMongoDB()
  res.json(frutas)
}

const getFrutaById = async (req, res) => {
  const frutaId = parseInt(req.params.id) || 0
  const client = await connectToMongoDB()
  if (!client) {
    res.status(500).send('Error al conectarse a MongoDB')
    return
  }

  const db = client.db('frutasDB')
  const fruta = await db.collection('frutas').findOne({ id: frutaId })
  await disconnectFromMongoDB()
  !fruta ? res.status(404).send(`No se encontró la fruta con ID ${frutaId}`) : res.json(fruta)
}

const getFrutaByName = async (req, res) => {
  const nombreFruta = req.params.nombre
  const client = await connectToMongoDB()
  if (!client) {
    res.status(500).send('Error al conectarse a MongoDB')
    return
  }

  const regex = new RegExp(nombreFruta.toLowerCase(), 'i')

  const db = client.db('frutasDB')
  const fruta = await db.collection('frutas').find({ nombre: regex }).toArray()
  await disconnectFromMongoDB()
  !fruta ? res.status(404).send(`No se encontró la fruta: ${nombreFruta}`) : res.json(fruta)
}

const getFrutasByPrice = async (req, res) => {
  const precioFruta = parseInt(req.params.precio) || 0
  const client = await connectToMongoDB()
  if (!client) {
    res.status(500).send('Error al conectarse a MongoDB')
    return
  }

  const db = client.db('frutasDB')
  const fruta = await db.collection('frutas').find({ importe: { $gte: precioFruta } }).toArray()
  await disconnectFromMongoDB()
  !fruta ? res.status(404).send('No se encontraron frutas con ese importe') : res.json(fruta)
}

const createFruta = async (req, res) => {
  const nuevaFruta = req.body // la fruta viene en el body
  if (nuevaFruta === undefined) {
    res.status(400).send('Error en el formato de datos a crear.')
  }

  const client = await connectToMongoDB()
  if (!client) {
    res.status(500).send('Error al conectarse a MongoDB')
  }

  const collection = client.db('frutasDB').collection('frutas') // obtener colección
  collection.insertOne(nuevaFruta)
    .then(() => {
      console.log('Nueva fruta creada:')
      res.status(201).send(nuevaFruta)
    })
    .catch(error => {
      console.error(error)
    })
    .finally(() => {
      client.close()
    })
}

const updateFruta = async (req, res) => {
  const id = req.params.id
  const nuevosDatos = await req.body

  if (!nuevosDatos) {
    res.status(400).send('Error en el formato de datos recibido.')
  }

  const client = await connectToMongoDB()
  if (!client) {
    res.status(500).send('Error al conectarse a MongoDB')
  }

  const collection = client.db('frutasDB').collection('frutas')
  collection.updateOne({ id: parseInt(id) }, { $set: nuevosDatos })
    .then(() => {
      console.log('Fruta modificada:')
      res.status(200).send(nuevosDatos)
    })
    .catch((error) => {
      res.status(500).json({ descripcion: `Error al modificar la fruta: ${error}` })
    })
    .finally(() => {
      client.close()
    })
}

const deleteFruta = async (req, res) => {
  const id = req.params.id
  if (!req.params.id) {
    return res.status(400).send('El formato de datos es erróneo o inválido.')
  }

  const client = await connectToMongoDB()
  if (!client) {
    return res.status(500).send('Error al conectarse a MongoDB')
  }

  client.connect()
    .then(() => {
      const collection = client.db('frutasDB').collection('frutas') // obtener colección
      return collection.deleteOne({ id: parseInt(id) })
    })
    .then((resultado) => {
      if (resultado.deletedCount === 0) {
        res.status(404).send('No se encontró ninguna fruta con el ID proporcionado:', id)
      } else {
        console.log('Fruta eliminada.')
        res.status(204).send()
      }
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send('Se produjo un error al intentar eliminar la fruta.')
    })
    .finally(() => {
      client.close()
    })
}

module.exports = {
  getAllFrutas,
  getFrutaById,
  getFrutaByName,
  getFrutasByPrice,
  createFruta,
  updateFruta,
  deleteFruta
}
