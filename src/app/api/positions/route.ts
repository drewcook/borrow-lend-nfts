// import { COLLECTION_ADDRESS } from '@/lib/constants'
// import infura from '@/lib/infura'

export async function GET(req: Request) {
	try {
		console.log('getting positions')
		return new Response(JSON.stringify({ data: 'data' }))
	} catch (error: any) {
		return new Response(JSON.stringify({ error }))
	}
}
