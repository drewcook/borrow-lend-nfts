const Vault = artifacts.require('Vault')
const LendNFT = artifacts.require('LendNFT')
const { parseEther } = require('viem')

module.exports = function (_deployer) {
	// Deploy the NFT collection
	_deployer.deploy(LendNFT)
	// Deploy the vault with 1 ETH loaded as liquidity
	_deployer.deploy(Vault, { value: parseEther('1') })
}
