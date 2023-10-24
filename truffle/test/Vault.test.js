const Vault = artifacts.require('Vault')
const LendNFT = artifacts.require('LendNFT')
const { parseEther } = require('viem')
const truffleAssert = require('truffle-assertions')

contract('Vault', function (accounts) {
	let vault
	let nft
	const TOKEN_URI = 'ipfs://example-uri'
	const ADMIN = accounts[0]
	const DEPOSITOR = accounts[1]
	const TOKEN_ID = 1
	const INITIAL_NFT_VALUE = parseEther('.1')
	const NEW_NFT_VALUE = parseEther('0.05')
	const LOAN_AMOUNT = parseEther('0.08')
	const INCORRECT_VALUE = parseEther('0.01')

	beforeEach(async function () {
		vault = await Vault.new()
		nft = await LendNFT.new()

		// Mint and deposit a token
		await nft.mint(TOKEN_URI, { from: DEPOSITOR })
		await nft.approve(vault.address, TOKEN_ID, { from: DEPOSITOR })
		await vault.depositNft(nft.address, TOKEN_ID, { from: DEPOSITOR })

		// Provide liquidity
		await vault.provideLiquidity({ value: Number(parseEther('0.5')), from: accounts[2] })
		await vault.provideLiquidity({ value: Number(parseEther('0.5')), from: accounts[3] })
		await vault.provideLiquidity({ value: Number(parseEther('0.5')), from: accounts[4] })
		await vault.provideLiquidity({ value: Number(parseEther('0.5')), from: accounts[5] })
		await vault.provideLiquidity({ value: Number(parseEther('0.5')), from: accounts[6] })
	})

	describe('Setting NFT Value', () => {
		it('should allow admin to set NFT value', async function () {
			const initialNftValue = await vault.getCurrentNftValue()
			assert.equal(initialNftValue, INITIAL_NFT_VALUE)
			await vault.setNftValue(NEW_NFT_VALUE, { from: ADMIN })
			const nftValue = await vault.getCurrentNftValue()
			assert.equal(nftValue, NEW_NFT_VALUE)
		})

		it('should not allow non-admin to set NFT value', async function () {
			await truffleAssert.reverts(vault.setNftValue(NEW_NFT_VALUE, { from: DEPOSITOR }))
		})
	})

	describe('Depositing an NFT', () => {
		it('should allow user to deposit NFT', async function () {
			const loan = await vault.getUserLoan(DEPOSITOR, nft.address, TOKEN_ID)
			assert.equal(loan.amount, 0)
			assert.equal(loan.nftValueAtTimeOfBorrow, INITIAL_NFT_VALUE)
			assert.equal(loan.active, true)
		})

		it('should not allow non-owner to deposit NFT', async function () {
			await truffleAssert.reverts(vault.depositNft(nft.address, TOKEN_ID, { from: ADMIN }))
		})

		it('should not allow user to deposit NFT twice', async function () {
			await truffleAssert.reverts(vault.depositNft(nft.address, TOKEN_ID, { from: DEPOSITOR }))
		})
	})

	describe('Borrowing against an NFT', () => {
		beforeEach(async () => {
			await vault.borrowLoan(nft.address, TOKEN_ID, { from: DEPOSITOR })
		})

		it('should allow user to borrow loan', async function () {
			const loan = await vault.getUserLoan(DEPOSITOR, nft.address, TOKEN_ID)
			assert.equal(loan.amount, LOAN_AMOUNT)
		})

		it('should not allow user to borrow loan twice', async function () {
			await truffleAssert.reverts(vault.borrowLoan(nft.address, TOKEN_ID, { from: DEPOSITOR }))
		})
	})

	describe('Repaying an outstanding loan', () => {
		it('should allow user to repay loan', async function () {
			await vault.borrowLoan(nft.address, TOKEN_ID, { from: DEPOSITOR })
			await vault.repayLoan(nft.address, TOKEN_ID, { from: DEPOSITOR, value: Number(LOAN_AMOUNT) })
			const loan = await vault.getUserLoan(DEPOSITOR, nft.address, TOKEN_ID)
			assert.equal(loan.amount, 0)
		})

		it('should not allow user to repay loan with incorrect amount', async function () {
			await vault.borrowLoan(nft.address, TOKEN_ID, { from: DEPOSITOR })
			await truffleAssert.reverts(
				vault.repayLoan(nft.address, TOKEN_ID, { from: DEPOSITOR, value: Number(INCORRECT_VALUE) }),
			)
		})
	})

	describe('Withdrawing an NFT', () => {
		it('should allow user to withdraw NFT', async function () {
			await vault.withdrawNft(nft.address, TOKEN_ID, { from: DEPOSITOR })
			const loan = await vault.getUserLoan(DEPOSITOR, nft.address, TOKEN_ID)
			assert.equal(loan.active, false)
		})

		it('should not allow user to withdraw NFT with outstanding loan', async function () {
			await vault.borrowLoan(nft.address, TOKEN_ID, { from: DEPOSITOR })
			await truffleAssert.reverts(vault.withdrawNft(nft.address, TOKEN_ID, { from: DEPOSITOR }))
		})
	})

	describe('Self-liquidations', () => {
		let valueToPayBack, loan
		beforeEach(async () => {
			await vault.borrowLoan(nft.address, TOKEN_ID, { from: DEPOSITOR })
			loan = await vault.getUserLoan(DEPOSITOR, nft.address, TOKEN_ID)
			valueToPayBack = Number(loan.amount) + (Number(loan.amount) - Number(NEW_NFT_VALUE))
		})

		it('should allow user to self-liquidate if undercollateralized', async function () {
			await vault.setNftValue(NEW_NFT_VALUE, { from: ADMIN })
			await vault.liquidateNft(nft.address, TOKEN_ID, { from: DEPOSITOR, value: valueToPayBack })
			loan = await vault.getUserLoan(DEPOSITOR, nft.address, TOKEN_ID)
			const deposit = await vault.getUserTokenDeposit(DEPOSITOR, nft.address, TOKEN_ID)
			assert.equal(loan.active, false)
			assert.equal(deposit, false)
		})

		it('should not allow user to liquidate NFT if still overcollateralized', async function () {
			await truffleAssert.reverts(vault.liquidateNft(nft.address, TOKEN_ID, { from: DEPOSITOR, value: valueToPayBack }))
		})

		it('should not allow user to liquidate NFT with incorrect amount', async function () {
			await truffleAssert.reverts(
				vault.liquidateNft(nft.address, TOKEN_ID, { from: DEPOSITOR, value: Number(INCORRECT_VALUE) }),
			)
		})
	})
})
