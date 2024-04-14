
# GENU.N Open Platform SDK - JavaScript Sample

This subdirectory is a React-based demonstration of the GENU.N Open Platform SDK for JavaScript. It demonstrates how to integrate the SDK into a React application, enabling users to log in using MetaMask or Web3Auth.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js version 18.18 or above. Use the `.nvmrc` file provided in this subdirectory to install or switch to the correct Node.js version with [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm).
- Yarn package manager for managing project dependencies.

## Installation

To set up the demo project, clone the SDK repository and navigate to this subdirectory. Install the dependencies with the following commands:

```sh
nvm use
yarn install
```

## Configuration

Configure the Web3Auth parameters within the `App.jsx` file to connect to the Web3Auth network. Obtain the `clientId` and `web3AuthNetwork` from your Web3Auth project dashboard, and set the `chainId` and `rpcTarget` based on the blockchain network your project will interact with. Update the `Web3AuthConfig` object in `App.jsx` with your specific values:

```javascript
const Web3AuthConfig = {
    clientId: 'your_web3auth_client_id', // Obtain from your Web3Auth project
    chainId: 'your_preferred_chain_id', // Set to the chain ID of the blockchain you want to use
    rpcTarget: 'your_blockchain_rpc_url', // Set to the RPC URL of your preferred blockchain
    web3AuthNetwork: 'your_web3auth_network', // Obtain from your Web3Auth project
}
```

Replace `your_web3auth_client_id`, `your_preferred_chain_id`, `your_blockchain_rpc_url`, and `your_web3auth_network` with the actual values specific to your setup.


## Usage

To run the project in development mode:

```sh
yarn dev
```

This will start the development server. By default, the application will be available at `http://localhost:3000`.

To create a production build:

```sh
yarn build
```

You can then preview the build with:

```sh
yarn preview
```

## Features

- **Login with MetaMask**: Authenticate users with their MetaMask wallet.
- **Login with Web3Auth**: Enable users to log in using Web3Auth, providing an alternative to MetaMask.

## Contributing

Contributions to the SDK or the example project are welcome. Please fork the entire SDK repository and submit a pull request with your changes.

## Support

For support, please open an issue in the main SDK repository. Provide as much context as possible about the problem you are encountering.
