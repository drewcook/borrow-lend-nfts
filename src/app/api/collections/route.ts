import { infura } from '@/lib/infura'

export async function POST(req: Request) {
	try {
		const { address } = await req.json()
		const result = await infura.api.getCollectionsByWallet({
			walletAddress: address,
		})
		console.log({ result })
		return new Response(JSON.stringify({ data: result }))
	} catch (error: any) {
		return new Response(JSON.stringify({ error }))
	}
}
