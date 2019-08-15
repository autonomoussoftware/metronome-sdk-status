'use strict'

const { toWei } = require('web3-utils')

const ISA_TICKS = 10079
const MIN_PER_DAY = 1440
const SEC_PER_MIN = 60

const identity = v => v
const toInt = str => Number.parseInt(str, 10)
const toMs = secs => secs * 1000

/**
 * Calculate whether or not the next auction started.
 *
 * @param {string} lastPurchaseTick The last purchase tick.
 * @param {string} currAuction The current auction number.
 * @returns {boolean} If the next auction started.
 */
const isNextAuction = (lastPurchaseTick, currAuction) =>
  toInt(currAuction) !==
  Math.floor((toInt(lastPurchaseTick) - ISA_TICKS) / MIN_PER_DAY) + 1

/**
 * @typedef {object} MetronomeContracts
 * @property {object} Auctions The Web3 instance of the contract.
 * @property {object} AutonomousConverter The Web3 instance of the contract.
 */

/**
 * @typedef {object} MetronomeStatusApi
 * @property {Function} getAuctionStatus Get the status of the Auctions
 *                      contract.
 * @property {Function} getConverterStatus Get the status of the
 *                      AutonomousConverter contract.
 */

/**
 * Create functions to query the status of the Auctions and Autonomous Converter
 * contracts.
 *
 * @param {Promise<MetronomeContracts>|MetronomeContracts} contracts A promise
 *                                                         or an instance of
 *                                                         Metronome contracts.
 * @returns {MetronomeStatusApi} The status getters.
 */
function createMetronomeStatus (contracts) {
  const contractsPromise = Promise.resolve(contracts)

  /**
   * An object representing the auction status.
   *
   * @typedef {object} AuctionStatus
   * @property {string} currAuction The auction number.
   * @property {string} currentAuctionPrice The MET price.
   * @property {string} currTick The current tick.
   * @property {number} dailyAuctionStartTime The daily auctions start time.
   * @property {string} dailyMintable The amount at the start of the auction.
   * @property {number} genesisTime The ISA start time.
   * @property {string} lastPurchasePrice The last purchase price.
   * @property {number} lastPurchaseTime The last purchase time.
   * @property {string} minting The coins available in the current auction.
   * @property {number} nextAuctionTime The next auction start time.
   * @property {string} totalMET The total supply of MET.
   */

  /**
   * Get the status of the Auctions contract.
   *
   * @param {boolean} inMs Whether or not to convert times from sec to ms.
   * @returns {Promise<AuctionStatus>} The status.
   */
  const getAuctionStatus = inMs =>
    contractsPromise
      .then(({ Auctions }) =>
        Promise.all([
          Auctions.methods.dailyAuctionStartTime().call(),
          Auctions.methods.heartbeat().call(),
          Auctions.methods.lastPurchaseTick().call(),
          Auctions.methods.mintable().call(),
          inMs ? toMs : identity
        ])
      )
      .then(
        ([
          dailyAuctionStartTime,
          {
            _dailyMintable,
            _lastPurchasePrice,
            currAuction,
            currTick,
            currentAuctionPrice,
            genesisGMT,
            minting,
            nextAuctionGMT,
            proceedsBal,
            totalMET
          },
          lastPurchaseTick,
          mintable,
          maybeToMs
        ]) => ({
          currAuction,
          currentAuctionPrice,
          currTick,
          dailyAuctionStartTime: maybeToMs(toInt(dailyAuctionStartTime)),
          dailyMintable: _dailyMintable,
          genesisTime: maybeToMs(toInt(genesisGMT)),
          lastPurchasePrice: _lastPurchasePrice,
          lastPurchaseTime: maybeToMs(
            toInt(genesisGMT) + toInt(lastPurchaseTick) * SEC_PER_MIN
          ),
          minting: isNextAuction(lastPurchaseTick, currAuction)
            ? minting
            : mintable,
          nextAuctionTime: maybeToMs(toInt(nextAuctionGMT)),
          proceedsBal,
          totalMET
        })
      )

  /**
   * An object representing the autonomous converter status.
   *
   * @typedef {object} AutonomousConverterStatus
   * @property {string} currentConverterPrice The coins returned for 1 MET. The
   *                    converter price returned is for informational purposes
   *                    only as the conversion price will change depending on
   *                    the amount sent and the contract's balance.
   * @property {string} coinBalance The contract's coins balance. I.e. ETH.
   * @property {string} metBalance The contract's MET balance.
   */

  /**
   * Get the status of the AutonomousConverter contract.
   *
   * @returns {Promise<AutonomousConverterStatus>} The status.
   */
  const getConverterStatus = () =>
    contractsPromise.then(({ AutonomousConverter }) =>
      Promise.all([
        AutonomousConverter.methods
          .getEthForMetResult(toWei('1', 'ether'))
          .call(),
        AutonomousConverter.methods.getEthBalance().call(),
        AutonomousConverter.methods.getMetBalance().call()
      ]).then(([currentConverterPrice, coinBalance, metBalance]) => ({
        currentConverterPrice,
        coinBalance,
        metBalance
      }))
    )

  return {
    getAuctionStatus,
    getConverterStatus
  }
}

module.exports = createMetronomeStatus
