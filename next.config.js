/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		appDir: true,
	},
	webpack: config => {
		config.resolve.fallback = { fs: false }
		config.externals.push('pino-pretty', 'lokijs', 'encoding', 'fs')
		return config
	},
}

module.exports = nextConfig
