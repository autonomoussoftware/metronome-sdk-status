'use strict'

const chai = require('chai')

chai.should()

const createMetronomeStatus = require('..')

function createMethods (names, data) {
  return names.reduce(function (all, name) {
    return {
      ...all,
      ...{ [name]: () => ({ call: () => Promise.resolve(data[name]) }) }
    }
  }, {})
}

const contractsMock = data => ({
  Auctions: {
    methods: createMethods(
      ['dailyAuctionStartTime', 'heartbeat', 'lastPurchaseTick', 'mintable'],
      data
    )
  },
  AutonomousConverter: {
    methods: createMethods(
      ['getEthForMetResult', 'getEthBalance', 'getMetBalance'],
      data
    )
  }
})

describe('Metronome Status', function () {
  it('should get new auction status', function () {
    const data = {
      dailyAuctionStartTime: '1529884800', // 2018-06-25T00:00:00.000Z
      heartbeat: {
        _dailyMintable: '1000000000000000000',
        _lastPurchasePrice: '1000000000000000000',
        currAuction: '373', // 2018-07-02
        currentAuctionPrice: '500000000000000000',
        currTick: '545818', // 2019-07-02T00:59:00.000Z
        genesisGMT: '1529280060', // 2018-06-18T00:01:00.000Z
        minting: '1000000000000000000',
        nextAuctionGMT: '1562112000', // 2019-07-03T00:00:00.000Z
        totalMET: '10000000000000000000'
      },
      lastPurchaseTick: '544394', // 2019-07-01T01:15:00.000Z
      mintable: '0'
    }
    const api = createMetronomeStatus(contractsMock(data))
    return api.getAuctionStatus().then(function (status) {
      status.should.deep.equal({
        currAuction: '373',
        currentAuctionPrice: '500000000000000000',
        currTick: '545818',
        dailyAuctionStartTime: 1529884800,
        dailyMintable: '1000000000000000000',
        genesisTime: 1529280060,
        lastPurchasePrice: '1000000000000000000',
        lastPurchaseTime: 1561943700,
        minting: '1000000000000000000',
        nextAuctionTime: 1562112000,
        totalMET: '10000000000000000000'
      })
    })
  })

  it('should get running auction status', function () {
    const data = {
      dailyAuctionStartTime: '1529884800', // 2018-06-25T00:00:00.000Z
      heartbeat: {
        _dailyMintable: '1000000000000000000',
        _lastPurchasePrice: '1000000000000000000',
        currAuction: '373', // 2018-07-02
        currentAuctionPrice: '500000000000000000',
        currTick: '545820', // 2019-07-02T01:01:00.000Z
        genesisGMT: '1529280060', // 2018-06-18T00:01:00.000Z
        minting: '1000000000000000000',
        nextAuctionGMT: '1562112000', // 2019-07-03T00:00:00.000Z
        totalMET: '10000000000000000000'
      },
      lastPurchaseTick: '545819', // 2019-07-02T01:00:00.000Z
      mintable: '500000000000000000'
    }
    const api = createMetronomeStatus(contractsMock(data))
    return api.getAuctionStatus().then(function (status) {
      status.should.deep.equal({
        currAuction: '373',
        currentAuctionPrice: '500000000000000000',
        currTick: '545820',
        dailyAuctionStartTime: 1529884800,
        dailyMintable: '1000000000000000000',
        genesisTime: 1529280060,
        lastPurchasePrice: '1000000000000000000',
        lastPurchaseTime: 1562029200,
        minting: '500000000000000000',
        nextAuctionTime: 1562112000,
        totalMET: '10000000000000000000'
      })
    })
  })

  it('should get depleted auction status with times in ms', function () {
    const data = {
      dailyAuctionStartTime: '1529884800', // 2018-06-25T00:00:00.000Z
      heartbeat: {
        _dailyMintable: '1000000000000000000',
        _lastPurchasePrice: '1000000000000000000',
        currAuction: '373', // 2018-07-02
        currentAuctionPrice: '500000000000000000',
        currTick: '545839', // 2019-07-02T01:20:00.000Z
        genesisGMT: '1529280060', // 2018-06-18T00:01:00.000Z
        minting: '1000000000000000000',
        nextAuctionGMT: '1562112000', // 2019-07-03T00:00:00.000Z
        totalMET: '10000000000000000000'
      },
      lastPurchaseTick: '545834', // 2019-07-02T01:15:00.000Z
      mintable: '0'
    }
    const api = createMetronomeStatus(contractsMock(data))
    return api.getAuctionStatus(true).then(function (status) {
      status.should.deep.equal({
        currAuction: '373',
        currentAuctionPrice: '500000000000000000',
        currTick: '545839',
        dailyAuctionStartTime: 1529884800000,
        dailyMintable: '1000000000000000000',
        genesisTime: 1529280060000,
        lastPurchasePrice: '1000000000000000000',
        lastPurchaseTime: 1562030100000,
        minting: '0',
        nextAuctionTime: 1562112000000,
        totalMET: '10000000000000000000'
      })
    })
  })

  it('should get converter status', function () {
    const data = {
      getEthForMetResult: '500000000000000000',
      getEthBalance: '2000000000000000000',
      getMetBalance: '1000000000000000000'
    }
    const api = createMetronomeStatus(contractsMock(data))
    return api.getConverterStatus().then(function (status) {
      status.should.deep.equal({
        currentConverterPrice: '500000000000000000',
        coinBalance: '2000000000000000000',
        metBalance: '1000000000000000000'
      })
    })
  })
})
