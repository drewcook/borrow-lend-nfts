import { COLLECTION_ADDRESS } from '@/lib/constants'
import infura from '@/lib/infura'

export async function GET(req: Request) {
	try {
		const result = await infura.api.getLowestTradePrice({
			tokenAddress: COLLECTION_ADDRESS,
		})
		console.log('floor price', { result })
		return new Response(JSON.stringify({ data: result }))
	} catch (error: any) {
		return new Response(JSON.stringify({ error }))
	}
}
