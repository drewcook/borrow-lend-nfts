import { Paper, Typography } from '@mui/material'

import UserCollections from '@/components/UserCollections'

const styles = {
	paper: {
		p: 4,
		textAlign: 'center',
	},
}

const DefaultPage = () => {
	return (
		<Paper sx={styles.paper}>
			<Typography variant="h4" gutterBottom>
				Borrow & Lend Your NFT
			</Typography>
			<UserCollections />
		</Paper>
	)
}

export default DefaultPage
