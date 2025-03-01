import {ethers} from 'ethers'
const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY
const ABI = [
	{
		inputs: [],
		name: 'InvalidInitialization',
		type: 'error',
	},
	{
		inputs: [],
		name: 'NotInitializing',
		type: 'error',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'address',
				name: 'devAddress',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'agentId',
				type: 'bytes32',
			},
		],
		name: 'CreateAgent',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'string',
				name: 'userId',
				type: 'string',
			},
			{
				indexed: false,
				internalType: 'string',
				name: 'agentId',
				type: 'string',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'Deposit',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint64',
				name: 'version',
				type: 'uint64',
			},
		],
		name: 'Initialized',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'merchantId',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'orderId',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'userId',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'bytes32',
				name: 'agentId',
				type: 'bytes32',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'PaymentToMerchant',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		name: 'agentIdToDevAddress',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: 'agentId',
				type: 'string',
			},
		],
		name: 'balanceOfAgent',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'userId',
				type: 'bytes32',
			},
			{
				internalType: 'bytes32',
				name: 'agentId',
				type: 'bytes32',
			},
		],
		name: 'balanceOfUserInAgent',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'devAddress',
				type: 'address',
			},
			{
				internalType: 'bytes32',
				name: 'agentId',
				type: 'bytes32',
			},
		],
		name: 'createAgent',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'userId',
				type: 'bytes32',
			},
			{
				internalType: 'bytes32',
				name: 'agentId',
				type: 'bytes32',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'deposit',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		name: 'devToAgentIds',
		outputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		name: 'devToAgnetIdToBalance',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'to',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'emergencyWithdraw',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_usdcAddress',
				type: 'address',
			},
			{
				internalType: 'address',
				name: '_owner',
				type: 'address',
			},
		],
		name: 'initialize',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		name: 'merchantIdToAddress',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		name: 'merchantIdToOrderIdToAmount',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'merchantId',
				type: 'bytes32',
			},
			{
				internalType: 'bytes32',
				name: 'orderId',
				type: 'bytes32',
			},
			{
				internalType: 'bytes32',
				name: 'userId',
				type: 'bytes32',
			},
			{
				internalType: 'bytes32',
				name: 'agentId',
				type: 'bytes32',
			},
			{
				internalType: 'uint256',
				name: 'amount',
				type: 'uint256',
			},
		],
		name: 'payToMerchant',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: 'merchantId',
				type: 'bytes32',
			},
			{
				internalType: 'address',
				name: 'merchantAddress',
				type: 'address',
			},
		],
		name: 'setMerchantAddress',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_owner',
				type: 'address',
			},
		],
		name: 'setOwner',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_usdcAddress',
				type: 'address',
			},
		],
		name: 'setUsdcAddress',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'usdcAddress',
		outputs: [
			{
				internalType: 'address',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
			{
				internalType: 'bytes32',
				name: '',
				type: 'bytes32',
			},
		],
		name: 'userIdToAgentIdToBalance',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
]
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const provider = new ethers.JsonRpcProvider(
	`https://base-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
)

const contract = new ethers.Contract(contractAddress, ABI, provider)

export const callAgnetContract = async (method: string, args: any[]) => {
    const result = await contract[method](...args)
    return result
}