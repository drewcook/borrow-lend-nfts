// Import the libraries and load the environment variables.
import { Auth, SDK } from '@infura/sdk'

// Instantiate Infura SDK
const auth = new Auth({
	projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
	secretId: process.env.NEXT_PUBLIC_INFURA_API_KEY_SECRET,
	privateKey: process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY,
	chainId: 5,
})

export const infura = new SDK(auth)
