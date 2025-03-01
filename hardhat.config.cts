import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'
import { type HardhatUserConfig } from 'hardhat/config'
import * as dotenv from 'dotenv'

dotenv.config()

const mnemnoc =
	typeof process.env.MNEMONIC === 'undefined' ? '' : process.env.MNEMONIC

const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.24',
		settings: {
			optimizer: {
				enabled: true,
				runs: 1000,
			},
		},
	},
	networks: {
		mainnet: {
			url: `https://mainnet.infura.io/v3/${process.env.ALCHEMLY_KEY!}`,
			accounts: {
				mnemonic: mnemnoc,
			},
		},
		mainnetSepolia:{
			url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMLY_KEY!}`,
			accounts: {
				mnemonic: mnemnoc,
			}
		},
		arbitrumOne: {
			url: `https://arbitrum-mainnet.infura.io/v3/${process.env.ALCHEMLY_KEY!}`,
			accounts: {
				mnemonic: mnemnoc,
			},
		},
		polygonMainnet: {
			url: `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMLY_KEY!}`,
			accounts: {
				mnemonic: mnemnoc,
			},
		},
		flowEVMTestNet : {
			url: `https://flow-testnet.g.alchemy.com/v2/${process.env.ALCHEMLY_KEY!}`,
			accounts: {
				mnemonic: mnemnoc,
			},
		},
		// deployed via remix
		zkSyncSepolia : {
			url: `https://zksync-sepolia.g.alchemy.com/v2/${process.env.ALCHEMLY_KEY!}`,
			accounts: {
				mnemonic: mnemnoc,
			}
		},
		baseSepolia : {
			url: `https://base-sepolia.g.alchemy.com/v2/${process.env.ALCHEMLY_KEY!}`,
			accounts : {
				mnemonic: mnemnoc,
			}
		}
	},
	etherscan: {
		apiKey: {
			...((k) => (k ? { mainnet: k } : undefined))(process.env.ETHERSCAN_KEY),
			...((k) => (k ? { arbitrumOne: k, arbitrumTestnet: k } : undefined))(
				process.env.ARBISCAN_KEY,
			),
			...((k) => (k ? { polygon: k, polygonMumbai: k } : undefined))(
				process.env.POLYGONSCAN_KEY,
			),
		},
	},
}

export default config
