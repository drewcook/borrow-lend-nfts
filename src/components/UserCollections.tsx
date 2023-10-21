'use client'
import { useAccount } from '@metamask/sdk-react-ui'
import { Button, Typography } from '@mui/material'

const UserCollections = () => {
	const { address, isConnected } = useAccount()

	const getUserCollections = async () => {
		try {
			const response = await fetch('/api/collections', {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					address,
				}),
			})
			console.log(response)
		} catch (e: any) {
			console.error(e)
		}
	}

	return (
		<>
			<Typography variant="h5" gutterBottom>
				Your NFT Holdings
			</Typography>
			{isConnected && (
				<>
					<Button variant="outlined" onClick={getUserCollections}>
						Get NFT Holdings
					</Button>
				</>
			)}
		</>
	)
}

export default UserCollections
