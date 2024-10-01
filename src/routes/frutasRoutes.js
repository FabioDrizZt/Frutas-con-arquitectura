const express = require('express')
const router = express.Router()
const frutasController = require('../controllers/frutasController.js')
// Endpoints
router.get('/frutas', frutasController.getAllFrutas)
router.get('/frutas/:id', frutasController.getFrutaById)
router.get('/frutas/nombre/:nombre', frutasController.getFrutaByName)
router.get('/frutas/importe/:precio', frutasController.getFrutasByPrice)
router.post('/frutas', frutasController.createFruta)
router.put('/frutas/:id', frutasController.updateFruta)
router.delete('/frutas/:id', frutasController.deleteFruta)

module.exports = router
