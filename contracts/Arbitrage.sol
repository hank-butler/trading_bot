// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.19;

// Adding import, reading in IVAUlT
import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IFlashLoanRecipient.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";

contract Arbitrage is IFlashLoanRecipient {
    IVault private constant vault = IVault(); // what is this? Need address inside it.

    IUniswapV2Router02 public immutable sRouter;
    IUniswapV2Router02 public immutable uRouter;
    address public owner;

    constructor(address _sRouter, address _uRouter) {
        sRouter = IUniswapV2Router(_sRouter); // Sushiswap
        uRouter = IUniswapV2Router(_uRouter); // Uniswap
        // Add routers for uniswap, sushiswap
        owner = msg.sender; // person calling contract

    }

    function executeTrade(
        bool _startOnUniswap,
        address _token0,
        address _token1,
        uint256 _flashAmount
    ) external {
        bytes memory data = abi.encode(_startOnUniswap, _token0, _token1);

        IER20[] memory tokens = new IERC20[](1);
        tokens[0] = IERC20(_token0);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = _flashAmount;

        valut.flashLoan(this, tokens, amounts, data);
    }

    function receiveFlashLoan(

    )
    external override {
        require(msg.sender == address(vault));

        uint256 flashAmount = amounts[0]; //indexing into first element of amounts array

        (bool startOnUniswap, address token0, address token1) = abi.decode(
            userData,
            (bool, address, address)
        );

        address[] memory path = new address[](2);

        path[0] = token0;
        path[1] = token1;

        if (startOnUniswap) {
            _swapOnUniswap(path, flashAmount, 0);

            path[0] = token1;
            path[1] = token0;

            _swapOnSushiSwap(
                path,
                IERC20(token1).balanceOf(address(this)),
                flashAmount // 
            );
        } else 
    }

}