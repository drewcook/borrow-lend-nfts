const HDWalletProvider = require('@truffle/hdwallet-provider')

require('dotenv').config()

const { NEXT_PUBLIC_INFURA_API_KEY, NEXT_PUBLIC_WALLET_PRIVATE_KEY } = process.env

module.exports = {
	networks: {
		development: {
			host: '127.0.0.1', // Localhost (default: none)
			port: 8545, // Standard Ethereum port (default: none)
			network_id: '*', // Any network (default: none)
		},
		goerli: {
			provider: () =>
				new HDWalletProvider({
					privateKeys: [NEXT_PUBLIC_WALLET_PRIVATE_KEY],
					providerOrUrl: `https://goerli.infura.io/v3/${NEXT_PUBLIC_INFURA_API_KEY}`,
				}),
			network_id: 5, // Goerli's id
			confirmations: 2, // # of confirmations to wait between deployments. (default: 0)
			timeoutBlocks: 200, // # of blocks before a deployment times out  (minimum/default: 50)
			skipDryRun: true, // Skip dry run before migrations? (default: false for public nets )
		},
	},

	compilers: {
		solc: {
			version: '0.8.21',
			settings: {
				optimizer: {
					enabled: false,
					runs: 200,
				},
				evmVersion: 'byzantium',
			},
		},
	},

	// Truffle DB is currently disabled by default; to enable it, change enabled:
	// false to enabled: true. The default storage location can also be
	// overridden by specifying the adapter settings, as shown in the commented code below.
	//
	// NOTE: It is not possible to migrate your contracts to truffle DB and you should
	// make a backup of your artifacts to a safe location before enabling this feature.
	//
	// After you backed up your artifacts you can utilize db by running migrate as follows:
	// $ truffle migrate --reset --compile-all
	//
	// db: {
	//   enabled: false,
	//   host: "127.0.0.1",
	//   adapter: {
	//     name: "indexeddb",
	//     settings: {
	//       directory: ".db"
	//     }
	//   }
	// }
}
