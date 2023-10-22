'use client'
import MenuIcon from '@mui/icons-material/Menu'
import { AppBar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import Link from 'next/link'
import { useState } from 'react'

import ConnectWalletButton from './ConnectWalletButton'

const styles = {
	appBar: { backgroundColor: grey[900] },
	navigationMobileWrap: { flexGrow: 0, display: { xs: 'flex', md: 'none' }, mr: 1 },
	navigationMobileMenu: { display: { xs: 'block', md: 'none' } },
	navigationDesktopWrap: { flexGrow: 1, display: { xs: 'none', md: 'flex' } },
	logoMobile: {
		mr: 2,
		display: { xs: 'flex', md: 'none' },
		flexGrow: 1,
		fontFamily: 'monospace',
		fontWeight: 700,
		letterSpacing: '.3rem',
		color: 'inherit',
		textDecoration: 'none',
	},
	logoDesktop: {
		mr: 2,
		display: { xs: 'none', md: 'flex' },
		fontFamily: 'monospace',
		fontWeight: 700,
		letterSpacing: '.3rem',
		color: 'inherit',
		textDecoration: 'none',
	},
	navigationLink: { my: 2, color: 'white', display: 'block' },
	userAvatar: { ml: 1, width: '24px', height: '24px', flexGrow: 0, fontSize: '12px' },
}

const AppHeader = () => {
	const dappTitleText = 'LENDNFT'
	// Navigation Pages
	const pages = [
		{
			text: 'Lend & Borrow',
			href: '/',
		},
	]

	// State
	const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)

	const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorElNav(event.currentTarget)
	}

	const handleCloseNavMenu = () => {
		setAnchorElNav(null)
	}

	return (
		<AppBar position="static" elevation={0} sx={styles.appBar}>
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					{/* Mobile Navigation */}
					<Box sx={styles.navigationMobileWrap}>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MenuIcon />
						</IconButton>
						<Menu
							id="menu-appbar"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical: 'bottom',
								horizontal: 'left',
							}}
							keepMounted
							transformOrigin={{
								vertical: 'top',
								horizontal: 'left',
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={styles.navigationMobileMenu}
						>
							{pages.map(page => (
								<Link key={page.text} href={page.href}>
									<MenuItem onClick={handleCloseNavMenu}>
										<Typography textAlign="center">{page.text}</Typography>
									</MenuItem>
								</Link>
							))}
						</Menu>
					</Box>

					{/* Logo */}
					<Typography variant="h6" noWrap component="a" href="/" sx={styles.logoDesktop}>
						{dappTitleText}
					</Typography>
					<Typography variant="h5" noWrap component="a" href="/" sx={styles.logoMobile}>
						{dappTitleText}
					</Typography>

					{/* Desktop Navigation */}
					<Box sx={styles.navigationDesktopWrap}>
						{pages.map(page => (
							<Link key={page.text} href={page.href}>
								<Button onClick={handleCloseNavMenu} sx={styles.navigationLink}>
									{page.text}
								</Button>
							</Link>
						))}
					</Box>
					<ConnectWalletButton />
				</Toolbar>
			</Container>
		</AppBar>
	)
}

export default AppHeader
