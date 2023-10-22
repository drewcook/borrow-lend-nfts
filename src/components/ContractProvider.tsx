'use client'
import { useSDK } from '@metamask/sdk-react'
import {
	Chain,
	useAccount,
	usePublicClient,
	useSwitchOrAddNetwork,
	useWalletClient,
	WalletClient,
} from '@metamask/sdk-react-ui'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getContract, parseEther } from 'viem'

// import { PublicClient, useAccount, useDisconnect, useNetwork, WalletClient } from 'wagmi'
import { COLLECTION_ADDRESS, TOKEN_URI, VAULT_ADDRESS } from '@/lib/constants'

import CollectionContract from '../../truffle/build/contracts/LendNFT.json'
import VaultContract from '../../truffle/build/contracts/Vault.json'

// Types
type ContractContextProps = {
	collection: any
	vault: any
	showWrongNetwork: boolean
	txSuccess: boolean
	txError: string | null
	mintNft: () => Promise<any>
	readVault: (fnName: string) => Promise<any>
	writeVault: (fnName: string, args: any[], value: number) => Promise<[unknown, WagmiString]>
	resetTxNotifications: () => void
}
type ContractProviderProps = {
	children: ReactNode
}
export type XString = `0x${string}`
export type WagmiString = XString | undefined

// Create context with initial values
/* eslint-disable @typescript-eslint/no-empty-function */
const initialContextValue: ContractContextProps = {
	collection: undefined,
	vault: undefined,
	showWrongNetwork: false,
	txSuccess: false,
	txError: null,
	mintNft: () => {
		throw new Error('No collection address set')
	},
	readVault: async () => {
		throw new Error('No vault address set')
	},
	writeVault: async () => {
		throw new Error('No vault address set')
	},
	resetTxNotifications: () => {},
}
/* eslint-enable @typescript-eslint/no-empty-function */
const ContractContext = createContext<ContractContextProps>(initialContextValue)

// Provider component
export const ContractProvider = ({ children }: ContractProviderProps): JSX.Element => {
	// Hook Data
	const { chainId } = useSDK()
	const { address } = useAccount()
	const publicClient = usePublicClient({ chainId: 5 })
	const { data, isError, isLoading } = useWalletClient({ chainId: 5 })
	const { chains, switchOrAddNetwork } = useSwitchOrAddNetwork()

	// Local State
	const [walletClient, setWalletClient] = useState<WalletClient | undefined>()
	const [nftContract, setNftContract] = useState<any>()
	const [vaultContract, setVaultContract] = useState<any>()
	const [showWrongNetwork, setShowWrongNetwork] = useState<boolean>(false)
	const [txSuccess, setTxSuccess] = useState<boolean>(false)
	const [txError, setTxError] = useState<string | null>(null)

	// Context state
	const [contextValue, setContextValue] = useState<ContractContextProps>(initialContextValue)

	const preferGoerli = async (chainId: string) => {
		if (chainId != '0x5') {
			setShowWrongNetwork(true)
			const goerli: Chain = chains.filter(c => c.id === 5)[0]
			await switchOrAddNetwork(goerli)
		} else {
			setShowWrongNetwork(false)
		}
	}

	const resetTxNotifications = () => {
		setTxSuccess(false)
		setTxError(null)
	}

	const loadContracts = useCallback(() => {
		// LendNFT
		setNftContract(
			getContract({
				address: COLLECTION_ADDRESS,
				// @ts-ignore
				abi: CollectionContract.abi,
				// @ts-ignore
				publicClient,
				// @ts-ignore
				walletClient,
			}),
		)
		// Vault
		setVaultContract(
			getContract({
				address: VAULT_ADDRESS,
				// @ts-ignore
				abi: VaultContract.abi,
				// @ts-ignore
				publicClient,
				// @ts-ignore
				walletClient,
			}),
		)
	}, [publicClient, walletClient])

	const mintNft = useCallback(async (): Promise<[unknown, WagmiString]> => {
		try {
			const { request, result } = await publicClient.simulateContract({
				account: address,
				address: COLLECTION_ADDRESS,
				abi: CollectionContract.abi,
				functionName: 'mint',
				args: [TOKEN_URI],
			})
			const txHash: WagmiString = await walletClient?.writeContract(request)
			setTxSuccess(true)
			setTxError(null)
			return [result, txHash]
		} catch (error: any) {
			setTxSuccess(false)
			setTxError(error.message)
			throw error
		}
	}, [address, publicClient, walletClient])

	const readVault = useCallback(
		async (valueName: string) => {
			if (valueName === 'balance') {
				return await publicClient?.getBalance({ address: VAULT_ADDRESS })
			} else {
				return await publicClient?.readContract({
					address: VAULT_ADDRESS,
					abi: VaultContract.abi,
					account: address,
					functionName: valueName,
				})
			}
		},
		[address, publicClient],
	)

	const writeVault = useCallback(
		async (fnName: string, args: any[], value: number): Promise<[unknown, WagmiString]> => {
			try {
				const { request, result } = await publicClient.simulateContract({
					account: address,
					address: VAULT_ADDRESS,
					abi: VaultContract.abi,
					functionName: fnName,
					args: args,
					value: parseEther(`${value}`),
				})
				const txHash: WagmiString = await walletClient?.writeContract(request)
				setTxSuccess(true)
				setTxError(null)
				return [result, txHash]
			} catch (error: any) {
				setTxSuccess(false)
				setTxError(error.message)
				throw error
			}
		},
		[address, publicClient, walletClient],
	)

	// Load contracts on initial mount
	useEffect(() => {
		loadContracts()
	}, [])

	// Check for chain changes and prefer Goerli
	useEffect(() => {
		if (chainId) preferGoerli(chainId)
	}, [chainId])

	// Get wallet client
	useEffect(() => {
		if (data) {
			setWalletClient(data)
		}
	}, [data])

	// Update the context value when any relevant internal state changes (read values)
	// This keeps the context in sync with the local state
	useEffect(() => {
		setContextValue({
			collection: nftContract,
			vault: vaultContract,
			mintNft,
			readVault,
			writeVault,
			showWrongNetwork,
			txSuccess,
			txError,
			resetTxNotifications,
		})
	}, [nftContract, vaultContract, mintNft, readVault, writeVault, showWrongNetwork, txSuccess, txError])

	return <ContractContext.Provider value={contextValue}>{children}</ContractContext.Provider>
}

// Context hook
export const useContracts = () => {
	const context: ContractContextProps = useContext(ContractContext)
	if (context === undefined) {
		throw new Error('useContract must be used within an ContractProvider component.')
	}
	return context
}
