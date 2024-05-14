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

            const isProfitable = await determineProfitability(routerPath, token0contract, token0, token1)

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

    sPair.on('Swap', async () => {
        if (!isExecuting) {
            isExecuting = true

            const priceDifference = await checkPrice('Sushiswap', token0, token1)
            const routerPath = await determineDirection(priceDifference)

            if (!routerPath){
                console.log('No arb opportunities')
                console.log('='.repeat(30))
                isExecuting = false
                return
            }

            const isProfitable = await determineProfitability(routerPath, token0Contract, token0, token1)

            if (!isProfitable){
                console.log('No arb opportunities')
                console.log('='.repeat(30))
                isExecuting = false
                return
            }

            const receipt = await executeTrade(routerPath, token0contract, token1contract)

            isExecuting = false

        }
    })

    console.log('Waiting for swap opportunity')

    
}

const checkPrice = async (_exchange, _token0, _token1) => {
    isExecuting = true

    console.log(`Swap initiated on ${_exchange}, Checking Price`)

    const currentBlock = await provider.getBlockNumber()

    const uPrice = await calculatePrice(uPair)
    const sPrice = await calculatePrice(sPair)

    const uFPrice = Number(uPrice).toFixed(uints)
    const sFPrice = Number(sPrice).toFixed(uints)
    const priceDifference = (((uFPrice - sFPrice) / sFPrice) * 100).toFixed(2)

    return priceDifference
}

const determineDirection = async (_priceDifference) => {
    if (_priceDifference >= difference) {
        return [uRouter, sRouter]
    } else if (_priceDifference <= -(difference)) {
        return [sRouter, uRouter]
    } else {
        return null
    }
}

const determineProfitability = async (_routerPath, _token0Contract, _token0, _token1) => {
    let exchangeToBuy, exchangeToSell

    if (await _routerPath[0].getAddress() === await uRouter.getAddress()) {
        exchangeToBuy = 'Uniswap'
        exchangeToSell = 'Sushiswap'
    } else {
        exchangeToBuy = 'Sushiswap'
        exchangeToSell = 'Uniswap'
    }
}

 const uReserves = await getReserves(uPair)
 const sResevers = await getReserves(sPair)

 let minAmount

 if (uReserves[0] > sReserves[0]) {
    minAmount = BigInt(sReserves[0]) / BigInt(2)
 } else {
    minAmount = BigInt(uReserves[0]) / BigInt(2)
 }

 try {
    const estimate = await _routerPath[0].getAmountsIn(minAmount, [_token0.address, _token1.address])

    const result = await _routerPath[1].getAmountsIn(estimate[1], [_token1.address, _token0.address])

    const { amountIn, amountOut } = await simulate(estimate[0], _routerPath, _token0, _token1)

    const amountDifference = amountOut - amountIn

    const estimatedGasCost = gasLimit * gasPrice

    // Account variable
    const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    const ethBalanceBefore = ethers.formatUnits(await _token0Contract.balanceOf(account.address), 'ether')
    const ethBalanceAfter = ethBalanceBefore - estimatedGas

    const wethBalanceBefore = Number(ethers.formatUnits(await _token0Contract.balanceOf(account.address, 'ether')))
    const wethBalanceAfter = amountDifference + wethBalanceBefore
    const wethBalanceDifference = wethBalanceAfter - wethBalanceBefore

    const data = {
        'ETH Balance Before': ethBalanceBefore,
        'ETH Balance After': ethBalanceAfter,
        'ETH Spent (gas)': estimatedGasCost,
        'WETH Balance Before': wethBalanceBefore,
        'WETH Balance After': wethBalanceAfter,
        'WETH Gained/Lost': wethBalanceDifference,
        'Total +/-': wethBalanceDifference - estimatedGasCost
    }

    console.table(data)
    console.log()

    if (Number(amountOut) < Number(amountIn)) {
        return false
    }
    amount = ethers.parseUnits(amountIn, 'ether')
    return turn
 } catch(error){
    console.log(error)
    return false
 }

 const executeTrade = async (_routerPath, _token0Contract, _token1Contract) => {
    let startOnUniswap

    if (await _routerPath[0].getAddress() == await uRouter.getAddress()) {
        startOnUniswap = true
    } else {
        startOnUniswap = false
    }

    const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    const tokenBalanceBefore = await _token0Contract.balanceOf(account.address)
    const ethBalanceBefore = await provider.getBalance(account.address)

    const tokenBalanceDifference = tokenBalanceAfter - tokenBalanceBefore
    const ethBalanceDifference = ethBalanceBefore - ethBalanceAfter

    const data = {
        'ETH Balance Before': ethers.formatUnits(ethBalanceBefore, 'ether'),
    'ETH Balance After': ethers.formatUnits(ethBalanceAfter, 'ether'),
    'ETH Spent (gas)': ethers.formatUnits(ethBalanceDifference.toString(), 'ether'),
    '-': {},
    'WETH Balance BEFORE': ethers.formatUnits(tokenBalanceBefore, 'ether'),
    'WETH Balance AFTER': ethers.formatUnits(tokenBalanceAfter, 'ether'),
    'WETH Gained/Lost': ethers.formatUnits(tokenBalanceDifference.toString(), 'ether'),
    '-': {},
    'Total Gained/Lost': `${ethers.formatUnits((tokenBalanceDifference - ethBalanceDifference).toString(), 'ether')} ETH`
    }

    console.table(data)
 }

 main()