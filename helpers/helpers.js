const ethers = require("ethers")
const Big = require("big.js")

const IUniswapV2Pair = require("@uniswap/v2-core/build/IUniswapV2Pair.json")
const IERC20 = require("@openzeppelin/contracts/build/contracts/ERC20.json")

async function getTokenAndContract(_token0Address, _token1Address, _provider){
    const token0Contract = new ethers.Contract(_token0Address, IERC20.abi, _provider)
    const token1Contract = new ethers.Contract(_token1Address, IERC20.abi, _provider)

    const token0 = {
        address: _token0Address,
        decimals: 18, // ETH has 18 0's?
        symbol: await token0Contract.symbol(),
        name: await token0Contract.name()
    }

    const token1 = {
        address: _token1Address,
        deciamsl: 18,
        symbols: await token1Contract.symbol(),
        name: await token1Contract.name()
    }

    return {token0Contract, token1Contract, token0, token1}








}