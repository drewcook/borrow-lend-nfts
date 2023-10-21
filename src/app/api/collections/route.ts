import { NextResponse } from 'next/server'

import { getCollections } from '@/lib/infura'

// Utility for success responses
const getSuccessResponse = (data: any, status = 200): NextResponse => {
	return new NextResponse(
		JSON.stringify({
			status: 'success',
			data,
		}),
		{
			status,
			headers: { 'Content-Type': 'application/json' },
		},
	)
}

// Utility for error responses
const getErrorResponse = (status = 500, message: string, error: Error | null = null): NextResponse => {
	return new NextResponse(
		JSON.stringify({
			status: status < 500 ? 'fail' : 'error',
			message,
			error,
		}),
		{
			status,
			headers: { 'Content-Type': 'application/json' },
		},
	)
}

export async function GET(req: Request) {
	try {
		// Check address param
		const { searchParams } = new URL(req.url)
		const address = searchParams.get('address')
		if (address) {
			// Get the NFT collections for the given address
			const result = getCollections(address)
			return getSuccessResponse(result)
		} else {
			return getErrorResponse(400, 'Invalid parameters')
		}
	} catch (error: any) {
		return getErrorResponse(500, error.message, error)
	}
}
