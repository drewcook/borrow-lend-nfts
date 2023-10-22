import { COLLECTION_ADDRESS, infura } from '@/lib/infura'

export async function GET(req: Request) {
	try {
		const result = await infura.api.getLowestTradePrice({
			tokenAddress: COLLECTION_ADDRESS,
		})
		return new Response(JSON.stringify({ data: result }))
	} catch (error: any) {
		return new Response(JSON.stringify({ error }))
	}
}
