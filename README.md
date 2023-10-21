# Lend NFTs to Borrow ETH

This is a pared-down, feature-limited overcollateralized borrowing and lending platform that allows users to deposit an NFT as collateral in exchange for borrowing ETH up to 80% of the value of the NFT. This is built in the peer-to-protocol model where users will be able take out over-collateralized loans on their NFT. The token will be locked in the vault until the debt is fully repaid. For simplicity, the NFT values are statically set by an admin with access control (the deployer of the Vault contract), and users can only liquidate themselves. The loans don't bear any interest, and the liquidity can be provided by anyone.

There are some safeguards in place however. A user cannot borrow if the vault balance is too low. Borrows and repayment are paid in full and don't support partial amounts. Users are not allowed to liquidate other users. The "liquidation" fee is a simple calculation.'

**Example Scenarios:**

1. **Simple borrow & repay:** user deposits their NFT worth $100 and borrows $80. The token is locked in the contract until the user pays back $80.
2. **Liquidation event**: A user deposits their $100 NFT and borrows $80. An admin mimics a volatile price change and sets the value $50. The user now must pay back $110 to unlock it. This breaks down to their $80 debt plus a $30 fee which is the difference between the new value and the debt position.

## Libraries Used

It uses the following libraries:

- Truffle Suite
- Infura RPC Endpoints
- MetaMask React SDK
- Infura SDK
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
