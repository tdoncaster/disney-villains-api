const express = require('express')
const bodyParser = require('body-parser')
const { getAllVillains, getVillainBySlug, saveNewVillain, } = require('./disney-villains-api/Controllers/villains')

const app = express()

app.get('/villains', getAllVillains)

app.get('/villains/:slug', getVillainBySlug)

app.post('/villains', bodyParser.json(), saveNewVillain)



app.listen(1332, () => {
  console.log('Listening on port 1332...') // eslint-disable-line no-console
})
