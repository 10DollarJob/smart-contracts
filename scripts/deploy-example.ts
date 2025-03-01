/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ethers, upgrades } from 'hardhat'

async function main() {
	const testERC20Contract = await ethers.getContractFactory('TestERC20')
	const testERC20 = await testERC20Contract.deploy(
		'0x4042a17D26436fcbb78B99bB19F4055547D3EB43',
	)
	await testERC20.waitForDeployment()
	const testERC20Address = await testERC20.getAddress().then((a) => a)
	console.log({ testERC20Address })
	const tenDollarContract = await ethers.getContractFactory('TenDollarJob')
	const tenDollar = await upgrades.deployProxy(tenDollarContract, [
		testERC20Address,
		'0x4042a17D26436fcbb78B99bB19F4055547D3EB43',
	])
	await tenDollar.waitForDeployment()
	console.log('Deployed address:', await tenDollar.getAddress())
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
