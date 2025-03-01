// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TestERC20 is ERC20, Initializable {
	constructor(address preFundAddress) ERC20("Test Token", "TTK") {
		// Prefund the provided address with 100,000 tokens
		_mint(preFundAddress, 100000 * (10 ** decimals()));
	}

	// Open mint function: anyone can mint tokens to any address
	function mint(address to, uint256 amount) external {
		_mint(to, amount);
	}
}
