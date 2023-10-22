import { MetaMaskButton } from '@metamask/sdk-react-ui'

const ConnectWalletButton = (): JSX.Element => {
	return (
		<MetaMaskButton
			theme="dark"
			color="blue"
			shape="rounded-full"
			icon="original"
			text="Connect with MetaMask"
			connectedType="network-account-balance"
			wrongNetworkText="Switch to Goerli"
		/>
	)
}

export default ConnectWalletButton
