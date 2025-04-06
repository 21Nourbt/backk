const express = require('express')
const tableController = require('./../Controllers/tableController')
const router = express.Router()

router
    .route('/')
    .get(tableController.getAllTables)
    .post(tableController.createTable)

router
    .route('/:id')
    .get(tableController.getTableById)
    .patch(tableController.updateTable)
    .delete(tableController.deleteTable)

console.log('hi2')
module.exports = router