
const fse = require('fs-extra')
const path = require('path')

// Define file paths
const rootDir = path.join(__dirname, '..')
const sampleSourceDir = path.join(rootDir, 'src', 'html-sample')
const sampleSourceFilename = 'index.html'
const packageJsonPath = path.join(rootDir, 'package.json')

// Build into the dist directory
const builtHtmlDistDir = path.join(rootDir, 'dist')
const builtHtmlDistFilename = 'sample.html'
// Build into the sample directory
const builtHtmlSampleDir = path.join(rootDir, 'sample', 'html')
const builtHtmlSampleFilename = 'index.html'


// Async function to handle the process
async function updateAndCopyFiles() {
    console.log('Build HTML sample: Start')
    try {
        const encoding = 'utf8'
        // Read the package.json file
        const packageJsonPlainText = await fse.readFile(packageJsonPath, encoding)
        // Parse the contents of package.json
        const packageJson = JSON.parse(packageJsonPlainText)
        const packageVersion = packageJson.version
        const cdnEndpoint = process.env.NODE_ENV === 'development' ? '' : packageJson.cdnEndpoint

        // Read the HTML file
        const htmlSourceFilePath = path.join(sampleSourceDir, sampleSourceFilename)
        let htmlPlainText = await fse.readFile(htmlSourceFilePath, encoding)

        // Define the filename for the latest SDK version
        const latestSdkFilename = `genun-client-sdk.umd.${packageVersion}.min.js`
        // Replace the placeholder string with the actual SDK filename
        htmlPlainText = htmlPlainText.replace(/<latest-sdk-filename>/g, latestSdkFilename)
        // Replace the CDN endpoint placeholder with the actual CDN endpoint
        htmlPlainText = htmlPlainText.replace(/<cdn-endpoint>/g, cdnEndpoint)

        // Write the updated HTML file and copy other files
        // in source directory to the dist directory
        await fse.ensureDir(builtHtmlDistDir)
        await fse.copy(sampleSourceDir, builtHtmlDistDir)
        await fse.writeFile(path.join(builtHtmlDistDir, builtHtmlDistFilename), htmlPlainText, encoding)
        if (builtHtmlDistFilename !== sampleSourceFilename) {
            await fse.remove(path.join(builtHtmlDistDir, sampleSourceFilename))
        }

        if (process.env.NODE_ENV !== 'development') {
            // Write the updated HTML file and copy other files
            // in source directory to the sample directory
            await fse.ensureDir(builtHtmlSampleDir)
            await fse.copy(sampleSourceDir, builtHtmlSampleDir)
            await fse.writeFile(path.join(builtHtmlSampleDir, builtHtmlSampleFilename), htmlPlainText, encoding)
            if (builtHtmlSampleFilename !== sampleSourceFilename) {
                await fse.remove(path.join(builtHtmlSampleDir, sampleSourceFilename))
            }
        }

        console.log('  HTML file has been updated successfully.')
    } catch (err) {
        console.error(err)
    }
    console.log('Build HTML sample: Done')
}

// Execute the function
updateAndCopyFiles()
