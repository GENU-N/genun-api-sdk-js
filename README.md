# @genun/client-sdk

The`@genun/client-sdk` for JavaScript empowers developers to incorporate token gating into their apps effortlessly. It streamlines adding functionalities that demand users to possess digital tokens for access, enhancing security and exclusivity. This toolkit simplifies blockchain integration, allowing for innovative, personalized user experiences without the usual technical hurdles.

The SDK is a client-side library written in Javascript, you can easily integrated it into your existing React, Vue or static HTML solution.

## Documentation

For detailed documentation and API references, visit the `@genun/client-sdk` documentation site: [GENU-N Open Platform Documentation](https://open.genun.tech/docs/).

## Install with NPM

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


## Contributing to @genun/client-sdk

This section provides a step-by-step guide to help you set up the project for development purposes. Whether you're looking to contribute to the project or want to fork it for custom development, these instructions will get you up and running.

### Prerequisites

Before you begin, ensure that you have `yarn` installed on your system. Yarn is a fast, reliable, and secure dependency management tool. If you do not have Yarn installed, you can download it from [the Yarn website](https://yarnpkg.com/).

### Setting Up the Development Environment

Setting up the project is straightforward. Follow these steps to clone the repository and install its dependencies.

1. Open your terminal.
2. Clone the repository using the following command:

   ```sh
   git clone git@github.com:GENU-N/genun-client-sdk-js.git
   ```

3. Navigate into the cloned repository directory:

   ```sh
   cd genun-client-sdk-js
   ```

4. Install the project dependencies with Yarn:

   ```sh
   yarn install
   ```

After these steps, you will have a working copy of the project, and you're ready to start contributing or customizing.

### Understanding the Directory Structure

The project is structured as follows:

- `src/sdk`: Contains the source code for the GENU-N Open Platform API SDK. This is the core of the SDK, tailored for JavaScript applications.

- `src/html-sample`: Contains the source code for a sample HTML page that demonstrates how to include the SDK using a UMD package. This is useful for developers who prefer to work with plain HTML and script tags.

- `sample/html`: This directory holds an example HTML file that demonstrates how the SDK can be included and used in a web page via a UMD package. It serves as a live example that developers can reference or test in browsers.

- `sample/react`: Includes a sample React application that shows how to integrate the SDK using npm packages. This sample is ideal for developers who are working with React and want to see how to incorporate the SDK into their React components.

- `scripts`: Contains scripts for building the sample applications and for building and publishing the SDK package to npm. These scripts are essential for maintaining the SDK and ensuring that the published versions are up to date.

- `test`: Houses the test suite for the project. We use Mocha to ensure that our SDK maintains high standards of reliability and performance.

## Running Tests

Testing is a critical part of the development process. To run the test scripts locally on your machine, follow these steps:

1. Copy the configuration template file to create your personal configuration file:

   ```sh
   cp .mocharc-app-config.js.template .mocharc-app-config.js
   ```

2. Edit the `.mocharc-app-config.js` file with your preferred text editor. Fill in the required parameters to match your local environment setup.

3. Once your configuration file is set up, execute the test scripts with Yarn:

   ```sh
   yarn test
   ```

   Or, if you prefer npm:

   ```sh
   npm run test
   ```

Please ensure that you have correctly completed the configuration steps before running the test scripts to avoid any errors.


## Support

For any issues or support related to the SDK for JavaScript, please reach out to the project maintainers or file an issue in the project's repository.
