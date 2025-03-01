/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ethers, upgrades } from 'hardhat'

async function main() {
	const exampleContract = await ethers.getContractFactory('TenDollarJob')
	const example = await upgrades.deployProxy(exampleContract)
	await example.waitForDeployment()

	console.log('Deployed address:', await example.getAddress())
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
