'use client'
import { useAccount } from '@metamask/sdk-react-ui'
import { Paper, Typography } from '@mui/material'
import axios from 'axios'
import { useEffect } from 'react'

import { useContracts } from './ContractProvider'

const styles = {
	paper: {
		p: 4,
	},
	heading: {
		textAlign: 'center',
		mb: 4,
	},
}

const UserPositionsPanel = () => {
	const { address, isConnected } = useAccount()
	const { vault, readVault, writeVault } = useContracts()

	useEffect(() => {
		getUserPositions()
	}, [])

	const getUserPositions = async () => {
		try {
			const result = await axios.post('/api/positions', { address })
			console.log(result)
		} catch (e: any) {
			console.error(e)
		}
	}

	return (
		<Paper sx={styles.paper}>
			<Typography variant="h5" sx={styles.heading}>
				User Positions
			</Typography>
		</Paper>
	)
}

export default UserPositionsPanel
