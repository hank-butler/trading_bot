// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Adding import, reading in IVAUlT
import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IFlashLoanRecipient.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract Arbitrage is IFlashLoanRecipient {
    IVault private constant vault = IVault(); // what is this?

    IUniswapV2Router02 public immutable sRouter;
    IUniswapV2Router02 public immutable uRouter;
    address public owner;

    constructor(address _sRouter, address _uRouter) {
        // Add routers for uniswap, sushiswap
        owner = msg.sender; // person calling contract
    }
}