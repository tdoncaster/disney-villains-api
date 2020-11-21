// const villains = require('../villains')
// const { request } = require('express')
const Models = require('../Models')


const getAllVillains = async (request, response) => {
  const villains = await Models.villains.findAll({ attributes: ['name', 'movie', 'slug'] })

  return response.send(villains)
}

const getVillainBySlug = async (request, response) => {
  const { slug } = request.params

  const foundVillain = await Models.villains.findOne({ where: { slug }, attributes: ['name', 'movie', 'slug'] })

  return foundVillain ? response.send(foundVillain) : response.sendStatus(404)
}

const saveNewVillain = async (request, response) => {
  const { name, movie, slug } = request.body

  if (!name || !movie || !slug) {
    return response.status(400).send('The following fields are required: name, movie, slug')
  }

  const newVillain = await Models.villains.create({ name, movie, slug })

  return response.status(201).send(newVillain)
}


module.exports = { getAllVillains, getVillainBySlug, saveNewVillain }
