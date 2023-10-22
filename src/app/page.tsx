'use client'
import { useAccount } from '@metamask/sdk-react-ui'
import { Box, Container, Grid, Typography } from '@mui/material'

import ConnectWalletButton from '@/components/ConnectWalletButton'
import UserCollectionsPanel from '@/components/UserCollectionsPanel'
import UserPositionsPanel from '@/components/UserPositionsPanel'

const styles = {
	title: {
		mb: 8,
	},
	disconnectedPanel: {
		px: 6,
		textAlign: 'center',
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
	},
}

const DefaultPage = () => {
	const { isConnected } = useAccount()
	return (
		<>
			<Typography textAlign="center" variant="h4" sx={styles.title}>
				Borrow & Lend Your NFT
			</Typography>
			{!isConnected ? (
				<Container maxWidth="xs">
					<Box sx={styles.disconnectedPanel}>
						<Typography variant="h6" gutterBottom>
							Please connect your wallet to interact with the protocol
						</Typography>
						<ConnectWalletButton />
					</Box>
				</Container>
			) : (
				<Grid container spacing={4}>
					<Grid item xs={12} sm={6}>
						<UserCollectionsPanel />
					</Grid>
					<Grid item xs={12} sm={6}>
						<UserPositionsPanel />
					</Grid>
				</Grid>
			)}
		</>
	)
}

export default DefaultPage
