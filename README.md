# metronome-sdk-status

[![Build Status](https://travis-ci.com/autonomoussoftware/metronome-sdk-status.svg?branch=master)](https://travis-ci.com/autonomoussoftware/metronome-sdk-status)
[![Code Style](https://img.shields.io/badge/code%20style-bloq-0063a6.svg)](https://github.com/bloq/eslint-config-bloq)
[![Known Vulnerabilities](https://snyk.io/test/github/autonomoussoftware/metronome-sdk-status/badge.svg?targetFile=package.json)](https://snyk.io/test/github/autonomoussoftware/metronome-sdk-status?targetFile=package.json)

Auction and converter status functions for the Metronome SDK.

The status functions can be used as part of the Metronome SDK or standalone, providing the [`metronome-contracts`](https://github.com/autonomoussoftware/metronome-contracts-js) to the constructor function.

## Installation

```shell
npm install metronome-sdk-status
```

## Usage

### As a standalone library

```js
const Web3 = require('web3')
const MetronomeContracts = require('metronome-contracts')
const createMetronomeStatus = require('metronome-sdk-status')

const web3 = new Web3()
const metronomeContracts = new MetronomeContracts(web3)
const api = createMetronomeStatus(metronomeContracts)

api.getAuctionStatus().then(console.log)
```

## API

<a name="createMetronomeStatus"></a>

### createMetronomeStatus(contracts) ⇒ [<code>MetronomeStatusApi</code>](#MetronomeStatusApi)

Create functions to query the status of the Auctions and Autonomous Converter
contracts.

**Returns**: [<code>MetronomeStatusApi</code>](#MetronomeStatusApi) - The status getters.

| Param     | Type                                                                                                                             | Description                                      |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| contracts | [<code>Promise.&lt;MetronomeContracts&gt;</code>](#MetronomeContracts) \| [<code>MetronomeContracts</code>](#MetronomeContracts) | A promise or an instance of Metronome contracts. |

- [createMetronomeStatus(contracts)](#createMetronomeStatus) ⇒ [<code>MetronomeStatusApi</code>](#MetronomeStatusApi)
  - [~getAuctionStatus(inMs)](#createMetronomeStatus..getAuctionStatus) ⇒ [<code>Promise.&lt;AuctionStatus&gt;</code>](#AuctionStatus)
  - [~getConverterStatus()](#createMetronomeStatus..getConverterStatus) ⇒ [<code>Promise.&lt;AutonomousConverterStatus&gt;</code>](#AutonomousConverterStatus)

<a name="createMetronomeStatus..getAuctionStatus"></a>

#### createMetronomeStatus~getAuctionStatus(inMs) ⇒ [<code>Promise.&lt;AuctionStatus&gt;</code>](#AuctionStatus)

Get the status of the Auctions contract.

**Returns**: [<code>Promise.&lt;AuctionStatus&gt;</code>](#AuctionStatus) - The status.

| Param | Type                 | Description                                     |
| ----- | -------------------- | ----------------------------------------------- |
| inMs  | <code>boolean</code> | Whether or not to convert times from sec to ms. |

<a name="createMetronomeStatus..getConverterStatus"></a>

#### createMetronomeStatus~getConverterStatus() ⇒ [<code>Promise.&lt;AutonomousConverterStatus&gt;</code>](#AutonomousConverterStatus)

Get the status of the AutonomousConverter contract.

**Returns**: [<code>Promise.&lt;AutonomousConverterStatus&gt;</code>](#AutonomousConverterStatus) - The status.  
<a name="MetronomeContracts"></a>

### MetronomeContracts : <code>Object</code>

**Properties**

| Name                | Type                | Description                        |
| ------------------- | ------------------- | ---------------------------------- |
| Auctions            | <code>Object</code> | The Web3 instance of the contract. |
| AutonomousConverter | <code>Object</code> | The Web3 instance of the contract. |

<a name="MetronomeStatusApi"></a>

### MetronomeStatusApi : <code>Object</code>

**Properties**

| Name               | Type                  | Description                                         |
| ------------------ | --------------------- | --------------------------------------------------- |
| getAuctionStatus   | <code>function</code> | Get the status of the Auctions contract.            |
| getConverterStatus | <code>function</code> | Get the status of the AutonomousConverter contract. |

<a name="AuctionStatus"></a>

### AuctionStatus : <code>Object</code>

An object representing the auction status.

**Properties**

| Name                  | Type                | Description                                 |
| --------------------- | ------------------- | ------------------------------------------- |
| currAuction           | <code>string</code> | The auction number.                         |
| currentAuctionPrice   | <code>string</code> | The MET price.                              |
| dailyAuctionStartTime | <code>number</code> | The daily auctions start time.              |
| genesisTime           | <code>number</code> | The ISA start time.                         |
| lastPurchasePrice     | <code>string</code> | The last purchase price.                    |
| lastPurchaseTime      | <code>number</code> | The last purchase time.                     |
| minting               | <code>string</code> | The coins available in the current auction. |
| nextAuctionTime       | <code>number</code> | The next auction start time.                |
| totalMET              | <code>string</code> | The total supply of MET.                    |

<a name="AutonomousConverterStatus"></a>

### AutonomousConverterStatus : <code>Object</code>

An object representing the autonomous converter status.

**Properties**

| Name                  | Type                | Description                                                                                                                                                                                |
| --------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| currentConverterPrice | <code>string</code> | The coins returned for 1 MET. The converter price returned is for informational purposes only as the conversion price will change depending on the amount sent and the contract's balance. |
| coinBalance           | <code>string</code> | The contract's coins balance. I.e. ETH.                                                                                                                                                    |
| metBalance            | <code>string</code> | The contract's MET balance.                                                                                                                                                                |

## License

MIT
