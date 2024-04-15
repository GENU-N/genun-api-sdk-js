
# @genun/client-sdk

The`@genun/client-sdk` for JavaScript empowers developers to incorporate token gating into their apps effortlessly. It streamlines adding functionalities that demand users to possess digital tokens for access, enhancing security and exclusivity. This toolkit simplifies blockchain integration, allowing for innovative, personalized user experiences without the usual technical hurdles.

The SDK is a client-side library written in Javascript, you can easily integrated it into your existing React, Vue or static HTML solution.

## Documentation

For detailed documentation and API references, visit the `@genun/client-sdk` documentation site: [GENU-N Open Platform Documentation](https://open.genun.tech/docs/).

## Installation

The `@genun/client-sdk` depends on `axios` for making HTTP requests. Make sure to install `axios` if you haven't already.

Using Yarn:

```bash
yarn add axios @genun/client-sdk
```

Alternatively, you can use npm:

```bash
npm install axios @genun/client-sdk
```

## Using the UMD Build in HTML

If you're not using a modern JavaScript framework and prefer to include scripts directly in your HTML, you can use the UMD build from our CDN. Make sure to include `axios` as it's a peer dependency of the SDK.

Include the following scripts in your HTML file:

```html
<!-- Dependencies -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.6.2/axios.min.js"></script>
<!-- Include @genun/client-sdk -->
<script src="https://cdn.genunuserdata.online/genun-client-sdk.umd.1.5.2.min.js"></script>
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
