// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Adding import, reading in IVAUlT
import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IFlashLoanRecipient.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract Arbitrage is IFlashLoanRecipient {
    // bare bones of arbitrage contract

    // So we're goign to build an arb bot.

    // Going to need to take in different token prices from different dex's

    // Provide liquidity
    // and then do swaps
}