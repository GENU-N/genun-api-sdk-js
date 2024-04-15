
# @genun/client-sdk

The `@genun/client-sdk` for JavaScript is a comprehensive library that wraps the API services offered by the `GENU-N Open Platform`, facilitating the integration of `GENU-N` services into your JavaScript applications. This document provides guidance on setting up the SDK, managing dependencies with Yarn, and running Mocha test scripts.

## Documentation

For detailed documentation and API references, visit the GENU-N Client SDK documentation site: [GENU-N Open Platform Documentation](https://open.genun.tech/docs/).

## Installation

Install the package using Yarn by running the following command:

```bash
yarn add @genun/client-sdk
```

Alternatively, you can use npm:

```bash
npm install @genun/client-sdk
```

## Initialization

To begin using the SDK in your application, import it and create a new instance. Typically, this is done within the component where you wish to utilize the SDK's features.

### Example Initialization

```javascript
import { ClientSDK } from '@genun/client-sdk';

const genunClient = new ClientSDK({
    domain: 'YOUR_API_DOMAIN', // Replace with your actual domain
    apiKey: 'YOUR_API_KEY', // Replace with your actual API key
    loginRequiredHook() {
        // Logic to handle when API requires user authentication
        console.log('You need to log in to continue');
    },
    timeout: 10000, // Request timeout in milliseconds
});
```

Ensure you replace `'YOUR_API_DOMAIN'` and `'YOUR_API_KEY'` with the actual domain and API key provided by `GENU-N`.
