const chai = require('chai')
const sinon = require('sinon')
const sinonChai = require('sinon-chai')
const models = require('../disney-villains-api/Models')
const {
  afterEach, before, beforeEach, describe, it
} = require('mocha')
const { villainsList, singleVillain } = require('./mocks/villains')
// eslint-disable-next-line max-len
const { getAllVillains, getVillainBySlug, saveNewVillain } = require('../disney-villains-api/Controllers/villains')

chai.use(sinonChai)
const { expect } = chai

describe('Controllers - villains', () => {
  let sandbox
  let stubbedFindOne
  let stubbedSend
  let response
  let stubbedSendStatus
  let stubbedStatusSend
  let stubbedStatus

  before(() => {
    sandbox = sinon.createSandbox()

    stubbedFindOne = sandbox.stub(models.villains, 'findOne')

    stubbedSend = sandbox.stub()
    stubbedSendStatus = sandbox.stub()
    stubbedStatusSend = sandbox.stub()
    stubbedStatus = sandbox.stub()

    response = {
      send: stubbedSend,
      sendStatus: stubbedSendStatus,
      status: stubbedStatus,
    }
  })

  // eslint-disable-next-line no-undef
  beforeEach(() => {
    stubbedStatus.returns({ send: stubbedStatusSend })
  })


  afterEach(() => {
    sandbox.reset()
  })

  describe('getAllVillains', () => {
    it('retrieves a list of villains from the database and calls response.send() with the list', async () => {
      const stubbedFindAll = sinon.stub(models.villains, 'findAll').returns(villainsList)

      await getAllVillains({}, response)

      expect(stubbedFindAll).to.have.callCount(1)
      expect(stubbedSend).to.have.been.calledWith(villainsList)
    })
  })

  describe('getVillainBySlug', () => {
    // eslint-disable-next-line max-len
    it('retrieves the villain associated with the provided slug from the database and calls response.send with it', async () => {
      stubbedFindOne.returns(singleVillain)
      const request = { params: { slug: 'gaston' } }

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'gaston' } })
      expect(stubbedSend).to.have.been.calledWith(singleVillain)
    })
    it('returns a 404 when no villain is found', async () => {
      stubbedFindOne.returns(null)
      const request = { params: { slug: 'not-found' } }

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'not-found' } })
      expect(stubbedSendStatus).to.have.been.calledWith(404)
    })

    it('returns a 500 with an error message when the database call throws an error', async () => {
      stubbedFindOne.throws('ERROR!')
      const request = { params: { slug: 'throw-error' } }

      await getVillainBySlug(request, response)

      expect(stubbedFindOne).to.have.been.calledWith({ where: { slug: 'throw-error' } })
      expect(stubbedStatus).to.have.been.calledWith(500)
      expect(stubbedStatusSend).to.have.been.calledWith('Unable to retrieve Villain, please try again')
    })
  })

  describe('saveNewVillain', () => {
  // eslint-disable-next-line max-len
    it('accepts new villain details and saves them as a new villain, returning the saved record with a 201 status', async () => {
      const request = { body: singleVillain }
      // eslint-disable-next-line no-undef
      const stubbedCreate = sinon.stub(models.villains, 'create').returns(singleVillain)

      // eslint-disable-next-line no-undef
      await saveNewVillain(request, response)

      expect(stubbedCreate).to.have.been.calledWith(singleVillain)
      // eslint-disable-next-line no-undef
      expect(stubbedStatus).to.have.been.calledWith(201)
      // eslint-disable-next-line no-undef
      expect(stubbedStatusSend).to.have.been.calledWith(singleVillain)
    })
  })
})
