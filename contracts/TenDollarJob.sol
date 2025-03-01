// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.24;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TenDollarJob is Initializable {
	event CreateAgent(address devPAddress, address agentAddress);
	event Deposit(address agentAddress, uint256 amount);

	address public usdcAddress;
	address public owner;

	function initialize(
		address _usdcAddress,
		address _owner
	) public initializer {
		usdcAddress = _usdcAddress;
		owner = _owner;
	}

	function setOwner(address _owner) public onlyOwner {
		owner = _owner;
	}
	modifier onlyOwner() {
		require(msg.sender == owner, "AgentsManagerWallet: only owner");
		_;
	}

	// dev -> agnetId[]
	mapping(address => address[]) public devToAgentAddress;
	// agnetId -> devAddress
	mapping(address => address) public agentAddressToDevAddress;
	// dev -> agentId -> balance
	mapping(address => mapping(address => uint256))
		public devToAgnetAddressToBalance;

	function setUsdcAddress(address _usdcAddress) public onlyOwner {
		usdcAddress = _usdcAddress;
	}

	function createAgent(
		address devAddress,
		address agentAddress
	) public {
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

	function balanceOfAgent(
		address agentAddress
	) public view returns (uint256) {
		address devAddress = agentAddressToDevAddress[agentAddress];
		return devToAgnetAddressToBalance[devAddress][agentAddress];
	}

	function withDrawAgentFunds (address agentAddress) public {
		uint256 agentBalance =  balanceOfAgent(agentAddress);
		require(agentBalance > 0, "No funds to withdraw");
		address devWalletAddress = agentAddressToDevAddress[agentAddress];
		devToAgnetAddressToBalance[devWalletAddress][agentAddress] = 0;
		IERC20(usdcAddress).transfer(devWalletAddress, agentBalance);
	}

	// incase of emergency, protect users funds
	function emergencyWithdraw(address to, uint256 amount) public onlyOwner {
		require(to != address(0), "Invalid address");
		IERC20(usdcAddress).transfer(to, amount);
	}
}
