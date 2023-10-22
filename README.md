# Lend NFTs to Borrow ETH

[Demo Application](https://borrow-lend-nfts.vercel.app/)

This is a pared-down, feature-limited overcollateralized borrowing and lending platform that allows users to deposit an NFT as collateral in exchange for borrowing ETH up to 80% of the value of the NFT. This is built in the peer-to-protocol model where users will be able take out over-collateralized loans on their NFT. The token will be locked in the vault until the debt is fully repaid. For simplicity, the NFT values are statically set by an admin with access control (the deployer of the Vault contract), and users can only liquidate themselves. The loans don't bear any interest, and the liquidity can be provided by anyone.

There are some safeguards in place however. A user cannot borrow if the vault balance is too low. Borrows and repayment are paid in full and don't support partial amounts. Users are not allowed to liquidate other users. The "liquidation" fee is a simple calculation.'

**Example Scenarios:**

1. **Simple borrow & repay:** user deposits their NFT worth $100 and borrows $80. The token is locked in the contract until the user pays back $80.
2. **Liquidation event**: A user deposits their $100 NFT and borrows $80. An admin mimics a volatile price change and sets the value $50. The user now must pay back $110 to unlock it. This breaks down to their $80 debt plus a $30 fee which is the difference between the new value and the debt position.

## Contract Addresses deployed to Goerli with Truffle

There are two contracts that were developed, tested, and deployed with [Truffle Suite](https://trufflesuite.com/). The `Vault` contract holds all the logic for lending an NFT and borrowing against it, and the `LendNFT` contract is a simple ERC-721 collection. The contracts are deployed on the Goerli testnet.

| Name        | Address                                                                                                                      |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| LendNFT.sol | [0xCacd07793e9Cf8Ab2E274f7F86EF6897166063f8](https://goerli.etherscan.io/address/0xcacd07793e9cf8ab2e274f7f86ef6897166063f8) |
| Vault.sol   | [0x06e3a046C366AeF68606f74Ce6c67204192f0153](https://goerli.etherscan.io/address/0x06e3a046c366aef68606f74ce6c67204192f0153) |

## NFT Collection with an Infura IPFS Node

The collection is a simplified collection contract that allows for any token URI to be defined. However, when minting via the UI the token URI is set to `ipfs://QmZSvnED6peETuxUKC7MRdDyfNQiASGnC6WZApQGoSMgJW`. This holds the NFT metadata that represents an image pointing to `ipfs://QmWkpQCmm6UhzhYtjZHQMk4Yh6QFBrJT7eouPZQKiKqgwe`. Both of these files were uploaded through Infura, and the CIDs are being pinned by an [Infura IPFS Node](https://www.infura.io/product/ipfs). The IPFS node is using a [Dedicated Gateway](https://docs.infura.io/networks/ipfs/how-to/access-ipfs-content/dedicated-gateways).

Check out the [metadata](https://nft-lend.infura-ipfs.io/ipfs/QmZSvnED6peETuxUKC7MRdDyfNQiASGnC6WZApQGoSMgJW) and [image](https://nft-lend.infura-ipfs.io/ipfs/QmWkpQCmm6UhzhYtjZHQMk4Yh6QFBrJT7eouPZQKiKqgwe) via the Infura Dedicated Gateway!

The collection can be seen on [OpenSea](https://testnets.opensea.io/assets/goerli/0xcacd07793e9cf8ab2e274f7f86ef6897166063f8/1).

## Libraries Used

It uses the following Consensys Products:

- Truffle Suite
- Infura RPC Endpoints
- Infura IPFS Node & Gateway
- Infura SDK
- MetaMask Extension
- MetaMask React SDK

It uses the following libraries:

- Next 13
- React 18
- TypeScript
- Material UI
- Emotion
- Viem
- Wagmi
- ESLint
- Prettier
- Commitlint
- Yarn
- Husky Git Hooks

## Running the App Locally

1. Install dependencies: `yarn install`
2. Setup environment variables: `cp .env .env.local`
   1. Update values with appropriate keys
3. Run development server: `yarn dev`
4. Open browser: `http://localhost:3000`
   1. It will hot reload on each file save
5. Start editing: `src/app/page.tsx`
