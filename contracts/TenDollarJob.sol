// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @title TenDollarJob
/// @notice This contract manages agents and handles deposits and withdrawals of USDC tokens.
contract TenDollarJob is Initializable {
	/// @notice Emitted when a new agent is created.
	/// @param devPAddress The developer’s address that creates the agent.
	/// @param agentAddress The newly created agent's address.
	event CreateAgent(address devPAddress, address agentAddress);

	/// @notice Emitted when a deposit is made for an agent.
	/// @param agentAddress The agent’s address receiving the deposit.
	/// @param amount The amount of USDC deposited.
	event Deposit(address agentAddress, uint256 amount);

	/// @notice The USDC token contract address.
	address public usdcAddress;

	/// @notice The owner of the contract.
	address public owner;

	/// @notice Initializes the contract with the USDC token address and the owner.
	/// @param _usdcAddress The address of the USDC token contract.
	/// @param _owner The address of the initial owner.
	function initialize(
		address _usdcAddress,
		address _owner
	) public initializer {
		usdcAddress = _usdcAddress;
		owner = _owner;
	}

	/// @notice Allows the current owner to transfer ownership to a new owner.
	/// @param _owner The address of the new owner.
	function setOwner(address _owner) public onlyOwner {
		owner = _owner;
	}

	/// @notice Modifier that restricts access to only the owner.
	modifier onlyOwner() {
		require(msg.sender == owner, "AgentsManagerWallet: only owner");
		_;
	}

	/// @notice Maps developer addresses to an array of their agent addresses.
	mapping(address => address[]) public devToAgentAddress;

	/// @notice Maps an agent address to its corresponding developer address.
	mapping(address => address) public agentAddressToDevAddress;

	/// @notice Maps a developer address and an agent address to the agent's USDC balance.
	mapping(address => mapping(address => uint256))
		public devToAgnetAddressToBalance;

	/// @notice Updates the USDC token contract address.
	/// @param _usdcAddress The new USDC token address.
	function setUsdcAddress(address _usdcAddress) public onlyOwner {
		usdcAddress = _usdcAddress;
	}

	/// @notice Creates a new agent for a developer.
	/// @param devAddress The address of the developer creating the agent.
	/// @param agentAddress The new agent's address.
	function createAgent(address devAddress, address agentAddress) public {
		require(address(msg.sender) == devAddress, "illegal access");
		require(
			agentAddressToDevAddress[agentAddress] == address(0),
			"Agent already exists"
		);
		agentAddressToDevAddress[agentAddress] = devAddress;
		devToAgentAddress[devAddress].push(agentAddress);
		devToAgnetAddressToBalance[devAddress][agentAddress] = 0;
		emit CreateAgent(devAddress, agentAddress);
	}

	/// @notice Deposits USDC tokens to a specified agent's balance.
	/// @param agentAddress The address of the agent receiving the deposit.
	/// @param amount The amount of USDC to deposit.
	function deposit(address agentAddress, uint256 amount) public {
		require(
			agentAddressToDevAddress[agentAddress] != address(0),
			"Agent does not exist"
		);
		require(
			IERC20(usdcAddress).allowance(msg.sender, address(this)) >= amount,
			"AgentsManagerWallet: not enough allowance"
		);
		address devAddress = agentAddressToDevAddress[agentAddress];
		IERC20(usdcAddress).transferFrom(msg.sender, address(this), amount);
		devToAgnetAddressToBalance[devAddress][agentAddress] += amount;
		emit Deposit(agentAddress, amount);
	}

	/// @notice Returns the USDC balance associated with a specific agent.
	/// @param agentAddress The address of the agent.
	/// @return The balance of the agent.
	function balanceOfAgent(
		address agentAddress
	) public view returns (uint256) {
		address devAddress = agentAddressToDevAddress[agentAddress];
		return devToAgnetAddressToBalance[devAddress][agentAddress];
	}

	/// @notice Withdraws all funds from an agent's balance to its associated developer's wallet.
	/// @param agentAddress The address of the agent.
	function withDrawAgentFunds(address agentAddress) public {
		uint256 agentBalance = balanceOfAgent(agentAddress);
		require(agentBalance > 0, "No funds to withdraw");
		address devWalletAddress = agentAddressToDevAddress[agentAddress];
		devToAgnetAddressToBalance[devWalletAddress][agentAddress] = 0;
		IERC20(usdcAddress).transfer(devWalletAddress, agentBalance);
	}

	/// @notice Allows the owner to withdraw a specific amount of USDC tokens to a given address in case of an emergency.
	/// @param to The recipient address.
	/// @param amount The amount of USDC to withdraw.
	function emergencyWithdraw(address to, uint256 amount) public onlyOwner {
		require(to != address(0), "Invalid address");
		IERC20(usdcAddress).transfer(to, amount);
	}
}
