import { COLLECTION_ADDRESS, infura } from '@/lib/infura'

export async function POST(req: Request) {
	try {
		const { hash } = await writeContract({
			address: COLLECTION_ADDRESS,
			abi: collectionAbi,
			functionName: 'mint',
			args: [TOKEN_URI],
		})

		console.log({ hash })
		return new Response(JSON.stringify({ data: hash }))
	} catch (error: any) {
		return new Response(JSON.stringify({ error }))
	}
}
