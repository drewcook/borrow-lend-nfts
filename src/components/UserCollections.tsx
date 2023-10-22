'use client'
import { useAccount, useContractWrite } from '@metamask/sdk-react-ui'
import { Button } from '@mui/material'
import axios from 'axios'
import { useEffect } from 'react'

import collectionAbi from '../../truffle/build/contracts/LendNFT.json'
import { useContracts } from './ContractProvider'

const UserCollections = () => {
	const { address, isConnected } = useAccount()
	const { mintNft } = useContracts()

	const mintToken = async () => {
		try {
			await mintNft()
		} catch (e: any) {
			console.error(e)
		}
	}

	useEffect(() => {
		if (isConnected) {
			getUserCollections()
		}
	}, [isConnected])

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
		<>
			{isConnected && (
				<>
					<Button variant="outlined" onClick={mintToken}>
						Mint an NFT to Lend
					</Button>
					<Button variant="outlined" onClick={getFloorPrice}>
						Get Floor Price
					</Button>
				</>
			)}
		</>
	)
}

export default UserCollections
