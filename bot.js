require('./helpers/server.js')
require('dotenv').config();

const ethers = require('ethers')
const config = require('./config.json')
const { getTokenAndContract, getPairContract, getReserves, calculatePrice,  simulate } = require('./helpers/helpers')
const { provider, uFactory, uRouter, sFactory, sRouter, arbitrage } = require('./helpers/initialization')

// .env values go here
const arbFor = process.env.ARG_FOR // address of token we are attempting to arb
const arbAgainst = process.env.ARB_AGAINST
const units = process.env.UNITS
const difference = process.env.PRICE_DIFFERENCE
const gasLimit = process.env.GAS_LIMIT
const gasPrice = process.env.GAS_PRICE

let uPair, sPair, amount
let isExecuting = false

const main = async () => {
    const {token0Contract, token1Contract, token0, token1} = await getTokenAndContract(arbFor, arbAgainst, provider)
    uPair = await getPairContract(uFactory, token0.address, token1.address, provider)
    sPair = await getPairContract(sFactory, token0.address, token1.address, provider)

    console.log(`uPair address: ${await uPair.getAddress()}`)
    console.log(`sPair address: ${await sPair.getAddress()}`)

    uPair.on('Swap', async () => {
        if (!isExecuting) {
            isExecuting = true

            const priceDifference = await checkPrice('Uniswap', token0, token1)
            const routerPath = await determineDirection(priceDifference)

            if (!routerPath) {
                console.log('No Arb available')
                console.log('='.repeat(30))
                isExecuting = false
                return
            }

            const isProfitable = awiat determineProfitability(routerPath, token0contract, token0, token1)

            if (!isProfitable) {
                console.log(`no arg available`)
                console.log('='.repeat(30))
                isExecuting = false
                return
            }

            const receipt = await executeTrade(routerPath, token0contract, token1contract)

            isExecuting = false
        }
    })

    

    
}