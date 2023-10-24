// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract Vault is ERC721Holder {
	//////////////////////////////////////
	/// Errors
	//////////////////////////////////////

	// error Vault__ApprovalForTokenTransferFailed();
	error Vault__InvalidAmountSent();
	error Vault__InvalidLoanAmount();
	error Vault__LiquidityTooLow();
	error Vault__OnlyAdmin();
	error Vault__OnlyTokenHolder();
	error Vault__TokenAlreadyDeposited();
	error Vault__TokenNotDeposited();
	error Vault__TokenLoanMustBeActive();
	error Vault__TokenLoanMustBeEmpty();
	error Vault__TokenLoanMustNotBeEmpty();
	error Vault__TokenValueTooLowToBorrow();
	error Vault__TransferFailed();

	//////////////////////////////////////
	/// Storage Variables
	//////////////////////////////////////

	uint256 private constant MAX_LOAN_TO_VALUE_RATIO = 80;
	address private s_admin;
	uint256 private s_nftValue;
	// Tracks if a user has deposited a particular token ID in a given collection
	// user => (collection => (tokenId => true/false)))
	mapping(address => mapping(address => mapping(uint256 => bool))) private s_deposits;
	// Tracks if a user has an outstanding loan for a parituclar token ID in a given collection
	// user => (collection => (tokenId => true/false)))
	mapping(address => mapping(address => mapping(uint256 => Loan))) private s_loans;


	//////////////////////////////////////
	/// Structs
	//////////////////////////////////////

	struct Loan {
		uint256 amount;
		uint256 nftValueAtTimeOfBorrow;
		bool active;
	}

	//////////////////////////////////////
	/// Events
	//////////////////////////////////////

	event LiquidityProvided(uint256 amount);
	event LiquidityWithdrawn(address withdrawer, uint256 amount);
	event LoanBorrowed(address indexed user, uint256 amount);
	event LoanRepaid(address indexed user, uint256 amount);
	event NftValueUpdated(uint256 value);
	event NftDeposited(address indexed user, address indexed collection, uint256 indexed tokenId);
	event NftWithdrawn(address indexed user, address indexed collection, uint256 indexed tokenId);
	event NftLiquidated(address indexed user, address indexed collection, uint256 indexed tokenId, uint256 amountOwed);

	constructor() payable {
		s_admin = msg.sender;
		s_nftValue = 0.1 ether; // Initial static value of token.
	}

	receive() external payable {
		provideLiquidity();
	}
  fallback() external payable {
		provideLiquidity();
	}

	//////////////////////////////////////
	/// Modifiers
	//////////////////////////////////////

	modifier onlyAdmin() {
		if (msg.sender != s_admin) {
			revert Vault__OnlyAdmin();
		}
		_;
	}

	modifier onlyTokenOwner(address _collection, uint256 _tokenId) {
		// TODO: this needs to be updated as this contract will end up owning the token after deposits
		// require(IERC721(_collection).ownerOf(_tokenId) == msg.sender, "Vault: Caller is not the owner of the NFT");
		// if (msg.sender != s_admin) {
		// 	revert Vault__OnlyTokenHolder();
		// }
		_;
	}

	modifier tokenMustBeDeposited(address _collection, uint256 _tokenId) {
		if (!s_deposits[msg.sender][_collection][_tokenId]) {
			revert Vault__TokenNotDeposited();
		}
		_;
	}

	//////////////////////////////////////
	/// External Functions
	//////////////////////////////////////

	function provideLiquidity() public payable {
		emit LiquidityProvided(msg.value);
	}

	function setNftValue(uint256 _nftValue) external onlyAdmin {
		s_nftValue = _nftValue;
		emit NftValueUpdated(_nftValue);
	}

	function withdrawLiquidity() external onlyAdmin {
		// Transfer contract balance to owner
		uint256 withdrawAmount = address(this).balance;
		(bool ok, ) = payable(s_admin).call{value: withdrawAmount}("");
		if (!ok) {
			revert Vault__TransferFailed();
		}
		emit LiquidityWithdrawn(s_admin, withdrawAmount);
	}

	function depositNft(address _collection, uint256 _tokenId) external onlyTokenOwner(_collection, _tokenId) {
		if (s_deposits[msg.sender][_collection][_tokenId] == true) {
			revert Vault__TokenAlreadyDeposited();
		}

		// Update deposit state for provided token
		s_deposits[msg.sender][_collection][_tokenId] = true;

		// Open up a new empty loan for the provided token
		s_loans[msg.sender][_collection][_tokenId] = Loan(0, s_nftValue, true);

		// Approve this contract to act as an operator on behalf of the token owner
		// (bool success,) = _collection.delegatecall(abi.encodeWithSignature("approve(address,uint256)", address(this), _tokenId));
		// if (!success) revert Vault__ApprovalForTokenTransferFailed();

		// Transfer the token to the contract (locks it)
		IERC721(_collection).safeTransferFrom(msg.sender, address(this), _tokenId);

		// Emit event
		emit NftDeposited(msg.sender, _collection, _tokenId);
	}

	function borrowLoan(address _collection, uint256 _tokenId) external tokenMustBeDeposited(_collection, _tokenId) {
		Loan storage loan = s_loans[msg.sender][_collection][_tokenId];

		if (!loan.active) {
			revert Vault__TokenLoanMustBeActive();
		}
		if (loan.amount != 0) {
			revert Vault__TokenLoanMustBeEmpty();
		}

		// Calculate the loan amount to 80% of the value at the time it was borrowed
		uint256 nftValueAtTimeOfBorrow = loan.nftValueAtTimeOfBorrow;
		uint256 loanAmount = (nftValueAtTimeOfBorrow * MAX_LOAN_TO_VALUE_RATIO) / 100;

		// Update the loan amount
		loan.amount = loanAmount;

		// Check that the contract has enough to lend out
		if (address(this).balance < loanAmount) {
			revert Vault__LiquidityTooLow();
		}

		// Transfer the laon to the caller
		(bool ok, ) = payable(msg.sender).call{value: loan.amount}("");
		if (!ok) {
			revert Vault__TransferFailed();
		}

		emit LoanBorrowed(msg.sender, loanAmount);
	}

	function repayLoan(address _collection, uint256 _tokenId) external payable tokenMustBeDeposited(_collection, _tokenId) {
		Loan storage loan = s_loans[msg.sender][_collection][_tokenId];

		if (!loan.active) {
			revert Vault__TokenLoanMustBeActive();
		}
		if (loan.amount == 0) {
			revert Vault__TokenLoanMustNotBeEmpty();
		}

		if (msg.value != loan.amount) {
			revert Vault__InvalidAmountSent();
		}

		// Reset loan amount to be empty since it has been paid
		loan.amount = 0;

		emit LoanRepaid(msg.sender, msg.value);
	}

	function withdrawNft(address _collection, uint256 _tokenId) external onlyTokenOwner(_collection, _tokenId) tokenMustBeDeposited(_collection, _tokenId) {
		Loan storage loan = s_loans[msg.sender][_collection][_tokenId];

		if (!loan.active) {
			revert Vault__TokenLoanMustBeActive();
		}
		if (loan.amount != 0) {
			revert Vault__TokenLoanMustBeEmpty();
		}

		// Close out the loan for the user and remove deposit accounting
		loan.active = false;
		delete s_deposits[msg.sender][_collection][_tokenId];

		// Transfer the NFT back to the original owner
		IERC721(_collection).safeTransferFrom(address(this), msg.sender, _tokenId);

		emit NftWithdrawn(msg.sender, _collection, _tokenId);
	}

	function liquidateNft(address _collection, uint256 _tokenId) external payable onlyTokenOwner(_collection, _tokenId) tokenMustBeDeposited(_collection, _tokenId) {
		Loan storage loan = s_loans[msg.sender][_collection][_tokenId];

		if (!loan.active) {
			revert Vault__TokenLoanMustBeActive();
		}
		if (loan.amount == 0) {
			revert Vault__TokenLoanMustNotBeEmpty();
		}

		require(loan.nftValueAtTimeOfBorrow > s_nftValue, "Vault: User can only be liquidated if undercollateralized");

		// To "liquidate", the token owner must pay back the loan amount + the difference amount of under-collateralization in respect to the current value for the NFT, ie. the difference between the current value and the value at the time of depositing it
		uint256 fee = loan.amount - s_nftValue;
		uint256 amountOwed = loan.amount + fee;

		if (msg.value != amountOwed) {
			revert Vault__InvalidAmountSent();
		}

		// Close out the loan for the user and remove deposit accounting
		loan.active = false;
		delete s_deposits[msg.sender][_collection][_tokenId];

		// Transfer the NFT back to the original owner
		IERC721(_collection).safeTransferFrom(address(this), msg.sender, _tokenId);
		emit NftLiquidated(msg.sender, _collection, _tokenId, amountOwed);
	}

	//////////////////////////////////////
	/// Pure / View Functions
	//////////////////////////////////////

	function getLiquidity() public view returns (uint256) {
		return address(this).balance;
	}

	function getAdmin() external view returns (address) {
		return s_admin;
	}

	function getCurrentNftValue() external view returns (uint256) {
		return s_nftValue;
	}

	function getUserTokenDeposit(address _depositor, address _collection, uint256 _tokenId) external view returns (bool) {
		return s_deposits[_depositor][_collection][_tokenId];
	}

	function getUserLoan(address _depositor, address _collection, uint256 _tokenId) external view returns (Loan memory) {
		return s_loans[_depositor][_collection][_tokenId];
	}
}
