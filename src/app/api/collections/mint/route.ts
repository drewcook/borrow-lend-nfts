import { COLLECTION_ADDRESS, TOKEN_URI } from '@/lib/constants'

import CollectionContract from '../../../../../truffle/build/contracts/LendNFT.json'

export async function POST(req: Request) {
	try {
		// const { hash } = await writeContract({
		// 	address: COLLECTION_ADDRESS,
		// 	abi: CollectionContract.abi,
		// 	functionName: 'mint',
		// 	args: [TOKEN_URI],
		// })
		// console.log({ hash })

		return new Response(JSON.stringify({ data: 'minting...' }))
	} catch (error: any) {
		return new Response(JSON.stringify({ error }))
	}
}
