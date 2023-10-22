// Import the libraries and load the environment variables.
import { Auth, SDK } from '@infura/sdk'

// Create Auth object
const auth = new Auth({
	projectId: process.env.NEXT_PUBLIC_INFURA_API_KEY,
	secretId: process.env.NEXT_PUBLIC_INFURA_API_KEY_SECRET,
	privateKey: process.env.NEXT_PUBLIC_WALLET_PRIVATE_KEY,
	chainId: process.env.NODE_ENV === 'production' ? 5 : 5777,
})

// Instantiate SDK
const sdk = new SDK(auth)
const getCollectionsByWallet = async (walletAddress: string) => {
	const result = await sdk.api.getCollectionsByWallet({
		walletAddress: walletAddress,
	})
	console.log('collections:', result)
}

export const getCollections = async (walletAddress: string) => {
	try {
		await getCollectionsByWallet(walletAddress)
	} catch (error) {
		console.log(error)
	}
}
