'use client' // Tradeoff, for the benefit of having <WagmiConfig> in one place and "globally"
import './globals.css'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

import { MetaMaskUIProvider } from '@metamask/sdk-react-ui'
import { Box, Container, ThemeProvider } from '@mui/material'

import AppFooter from '@/components/AppFooter'
import AppHeader from '@/components/AppHeader'
import muiTheme from '@/lib/muiTheme'

const styles = {
	main: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
		alignItems: 'center',
		py: 6,
		minHeight: 'calc(100vh - calc(64px + 72px))',
	},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>
				<MetaMaskUIProvider
					debug={false}
					sdkOptions={{
						logging: {
							developerMode: false,
						},
						checkInstallationImmediately: false, // This will automatically connect to MetaMask on page load
						dappMetadata: {
							name: 'Lend NFTs and Borrow',
						},
					}}
				>
					<ThemeProvider theme={muiTheme}>
						<AppHeader />
						<Box component="main" sx={styles.main}>
							<Container maxWidth="xl">{children}</Container>
						</Box>
						<AppFooter />
					</ThemeProvider>
				</MetaMaskUIProvider>
			</body>
		</html>
	)
}
