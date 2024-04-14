# GENU-N SDK for JavaScript

## Overview

SDK for JavaScript is a comprehensive wrapper for the API services provided by the GENU-N Open Platform. This document outlines the procedures for setting up the SDK, managing dependencies with Yarn, running Mocha test scripts.

## Prerequisites

Ensure that `yarn` is installed on your system. Yarn is used for managing the project dependencies.

## Installation

To set up the project, start by cloning the repository and installing its dependencies:

```sh
git clone git@github.com:GENU-N/genun-client-sdk-js.git
cd genun-client-sdk-js
yarn install
```

## Directory Structure

- `src/sdk`: The source code for the GENU-N Open Platform API SDK, tailored for JavaScript applications. It provides developers with the tools needed to easily integrate GENU-N's platform services.

- `src/metamask`: A streamlined library for connecting with MetaMask, simplifying the integration of Ethereum wallet functionality into web apps.

- `test`: Our testing suite, leveraging Mocha for robust testing of our JavaScript SDK and MetaMask library to ensure reliability and performance.

## Running Test Scripts Locally

To run the test scripts on your local machine:

1. Copy the configuration template to create a configuration file:

   ```sh
   cp .mocharc-app-config.js.template .mocharc-app-config.js
   ```

2. Open `.mocharc-app-config.js` and fill in the necessary parameters as per your environment setup.

3. Run the test scripts using the following command:

   ```sh
   npm run test
   ```

Please make sure that you have completed the configuration steps before attempting to run the test scripts.


## Support

For any issues or support related to the SDK for JavaScript, please reach out to the project maintainers or file an issue in the project's repository.
