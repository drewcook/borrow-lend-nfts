'use client'
import { useAccount } from '@metamask/sdk-react-ui'
import { Button, Paper, Typography } from '@mui/material'
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

const UserCollectionsPanel = () => {
	const { address } = useAccount()
	const { collection, mintNft } = useContracts()

	const mintToken = async () => {
		try {
			await mintNft()
		} catch (e: any) {
			console.error(e)
		}
	}

	useEffect(() => {
		getUserCollections()
	}, [])

	const getFloorPrice = async () => {
		try {
			const response = await axios.get('/api/collections/floor-price')
			console.log(response)
		} catch (e: any) {
			console.error(e)
		}
	}

	const getUserCollections = async () => {
		try {
			const result = await axios.post('/api/collections', { address })
			console.log(result)
		} catch (e: any) {
			console.error(e)
		}
	}

	return (
		<Paper sx={styles.paper}>
			<Typography variant="h5" sx={styles.heading}>
				User Collections
			</Typography>
			<Typography gutterBottom>Mint a LendNFT to supply to the vault!</Typography>
			<Button variant="outlined" onClick={mintToken}>
				Mint
			</Button>
			<Button variant="outlined" onClick={getFloorPrice}>
				Get Floor Price
			</Button>
		</Paper>
	)
}

export default UserCollectionsPanel
