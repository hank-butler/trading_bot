const hre = require('hardhat')
require('dotenv').config()

const config = require('../config.json')
const IUniswapV2Router02 = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json')
const IUniswapV2Factory = require("@uniswap/v2-core/build/IUniswapV2Factory.json")

let _provider
if (config.PROJECT_SETTINGS.isLocal){
    provider = new hre.ethers.WebSocketProvider(`ws://127.0.0.1:8545/`)
} else {
    provider = new hre.ethers.WebSocketProvider(`wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`)
}