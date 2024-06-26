require("dotenv").config()

const hre = require("hre")

const { getTokenAndCotract, getPaircontract, calculatePrice } = require('../helpers/helpers')
const { provider,uFactory, uRouter,  sFactory, sRouter } = require('../helpers/initialization')

const V2_FACTORY_TO_USE = uFactory
const V2_ROUTER_TO_USE = uRouter

const UNLOCKED_AMOUNT = '' // Fill this out later
const AMOUNT = '40500000000000' // 40,500,000,000,000 SHIB -- Tokens will automatically be converted to wei

async function main() {
    const {
        token0Contract,
        token1Contract,
        token0: ARB_AGAINST,
        token1: ARB_FOR
    } = await getTokenAndContract(process.env.ARB_AGAINST, process.env.ARB_FOR, provider)

    const pair = await getPaircontract(V2_FACTORY_TO_USE, ARB_AGAINST.address, ARB_FOR.address, provider)

    const priceBefore = await calculatePrice(pair)

    await manipulatePrice([ARB_AGAINST, ARB_FOR], token0Contract)

    const priceAfter = await calculatePrice(pair)

    const data = {
        'Price before': `1 WETH = ${Number(priceBefore).toFixed(0)} SHIB`,
        'Price After': `1 WEth = ${Number(priceAfter).toFixed(0)} SHIB`,
    }

    console.table(data)

}

async function manipulatePrice(_path, _token0Contract){
    console.log(`\n Now this is swapping!\n`)

    console.log(`Input token : ${_path[0].symbol}`)
    console.log(`Input token : ${_path[1].symbol}\n`)

    const amount = hre.ethers.parseUnits(AMOUNT, 'ether')
    const path = [_path[0].address, _path[1].address];
    const deadline = Math.floor(Date.now() / 1000) + 60 * 30 // 30 minutes

    await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [UNLOCKED_ACCOUNT],
    })

    const signer = await hre.ethers.getSigner(UNLOCKED_ACCOUNT)

    const approval = await _token0Contract.connect(signer).approve(await V2_ROUTER_TO_USE.get_address(), amount, { gasLimit: 5000})   
    await approval.wait()
    
    const swap = await V2_ROUTER_TO_USE.connect(signer).swapExactTokensForToken(amount, 0, path, signer.address, deadline, {gasLimit: 10000})
    await swap.wait()

    console.log(`Swap complete! Great success!\n`)
}

main().catch((error)=> {
    console.error(error);
    process.exitCode = 1;
});