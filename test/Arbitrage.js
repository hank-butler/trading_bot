const { expect } = require('chai')
const { ethers } = require('hardhat')

const config = require('../config.json') // config file for doing things.

describe('Arbitrage', () => {
    let owner, arbitrage

    beforeEach(async () => {
        [owner] = await ethers.getSigners()

        arbitrage = await hre.ethers.deployContract(
            "Arbitrage",
            [
                config.SUSHISWAP.V2_ROUTER_O2_ADDRESS,
                config.UNISWAP.V2_ROUTER_O2_ADDRESS
            ]
        )

        await arbitrage.waitForDeployment()
    })

    describe('Deployment', () => {
        it('Sets the sRouter', async () => {
            expect(await arbitrage.sRouter()).to.equal(config.SUSHISWAP.V2_ROUTER_O2_ADDRESS)
        })

        it("Sets the uRouter", async () => {
            expect(await arbitrage.uRouter()).to.equal(config.UNISWAP.V2_ROUTER_O2_ADDRESS)
        })

        it("Sets the owner", async () => {
            expect(await arbitrage.owner()).to.equal(await owner.getAddress())
        })


    })
})