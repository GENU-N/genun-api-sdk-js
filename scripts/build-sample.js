const fs = require('fs').promises
const path = require('path')

// Define file paths
const rootDir = path.join(__dirname, '..')
const sampleFilename = 'sample.html'
const packageJsonPath = path.join(rootDir, 'package.json')
const htmlFilePath = path.join(rootDir, 'dist', sampleFilename)

// Async function to handle the process
async function updateAndCopyFiles() {
    try {
        // Read the package.json file
        const data = await fs.readFile(packageJsonPath, 'utf8')
        // Parse the contents of package.json
        const packageJson = JSON.parse(data)
        const packageVersion = packageJson.version
        const cdnEndpoint = process.env.NODE_ENV === 'development' ? '' : packageJson.cdnEndpoint

        // Read the HTML file
        let htmlData = await fs.readFile(htmlFilePath, 'utf8')

        // Define the filename for the latest SDK version
        const latestSdkFilename = `genun.sdk.umd.${packageVersion}.min.js`
        // Replace the placeholder string with the actual SDK filename
        htmlData = htmlData.replace(/<latest-sdk-filename>/g, latestSdkFilename)

        // Define the filename for the latest MetaMask version
        const latestMetamaskFilename = `genun.metamask.umd.${packageVersion}.min.js`
        // Replace the placeholder string with the actual MetaMask filename
        htmlData = htmlData.replace(/<latest-metamask-filename>/g, latestMetamaskFilename)

        // Replace the CDN endpoint placeholder with the actual CDN endpoint
        htmlData = htmlData.replace(/<cdn-endpoint>/g, cdnEndpoint)

        // Save the updated HTML file
        await fs.writeFile(htmlFilePath, htmlData, 'utf8')
        console.log('HTML file has been updated successfully.')
    } catch (err) {
        console.error(err)
    }
}

// Execute the function
updateAndCopyFiles()
