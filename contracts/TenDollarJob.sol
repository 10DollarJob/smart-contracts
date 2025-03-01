// SPDX-License-Identifier: MPL-2.0
pragma solidity =0.8.24;
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract TenDollarJob is Initializable {
	event CreateAgent(address devPAddress, address agentAddress);
	// event Deposit(string userId, string agentId, uint256 amount);
	// event PaymentToMerchant(
	// 	bytes32 merchantId,
	// 	bytes32 orderId,
	// 	bytes32 userId,
	// 	bytes32 agentId,
	// 	uint256 amount
	// );

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

	function createAgent(address devAddress, address agentAddress) public onlyOwner {
		require(
			agentIdToDevAddress[agentAddress] == address(0),
			"Agent ID already exists"
		);
		agentAddressToDevAddress[agentAddress] = devAddress;
		devToAgentAddress[devAddress].push(agentAddress);
		devToAgnetAddressToBalance[devAddress][agentId] = 0;
		emit CreateAgent(devAddress, agentAddress);
	}

	function deposit(address agentAddress, uint256 amount) public {
		require(
			agentAddressToDevAddress[agentAddress] != address(0),
			"Agent ID does not exist"
		);
		require(
			IERC20(usdcAddress).allowance(msg.sender, address(this)) >= amount,
			"AgentsManagerWallet: not enough allowance"
		);
		address devAddress = agentAgentToDevAddress[agentAddress];
		IERC20(usdcAddress).transferFrom(msg.sender, address(this), amount);
		devToAgnetAddressToBalance[devAddress][agentAddress] += amount;
	}

	function balanceOfAgent(
		address agentAddress
	) public view returns (uint256) {
		address devAddress = agentAddressToDevAddress[agentAddress];
		return devToAgnetAddressToBalance[devAddress][agentAddress];
	}

	function emergencyWithdraw(address to, uint256 amount) public onlyOwner {
		require(to != address(0), "Invalid address");
		IERC20(usdcAddress).transfer(to, amount);
	}
}
