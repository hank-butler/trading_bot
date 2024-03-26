require("dotenv").config()

const hre = require("hre")

const { getTokenAndConract, getPaircontract, calculatePrice } = require('../helpers/helpers')
const { provider,uFactory, uRouter,  sFactory, sRouter } = require('../helpers/initialization')

const V2_FACTORY_TO_USE = uFactory
const V2_ROUTER_TO_USE = uRouter