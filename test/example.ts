import { expect } from 'chai'
import { ethers, upgrades } from 'hardhat'

describe('Example', () => {
	describe('initialize', () => {
		describe('success', () => {
			it('initialize value', async () => {
				const [usdcAddress, owner] = await ethers.getSigners()
				const AgentsManagerWallet = await ethers.getContractFactory(
					'AgentsManagerWallet',
				)
				const agentsManagerWallet = await upgrades.deployProxy(
					AgentsManagerWallet,
					[usdcAddress.address, owner.address],
				)
				const usdc: string = await agentsManagerWallet.usdcAddress()
				const ownerAddress: string = await agentsManagerWallet.owner()
				expect(usdc).to.equal(usdcAddress.address)
				expect(ownerAddress).to.equal(owner.address)
			})
		})
		describe('fail', () => {
			it('should fail to initialize when already initialized', async () => {
				const [usdcAddress, owner] = await ethers.getSigners()
				const AgentsManagerWallet = await ethers.getContractFactory(
					'AgentsManagerWallet',
				)
				const agentsManagerWallet = await upgrades.deployProxy(
					AgentsManagerWallet,
					[usdcAddress.address, owner.address],
				)

				await expect(
					agentsManagerWallet.initialize(usdcAddress.address, owner.address),
				).to.be.revertedWithCustomError(
					agentsManagerWallet,
					'InvalidInitialization',
				)
				const usdc: string = await agentsManagerWallet.usdcAddress()
				const ownerAddress: string = await agentsManagerWallet.owner()
				expect(usdc).to.equal(usdcAddress.address)
				expect(ownerAddress).to.equal(owner.address)
			})
		})
	})
})
