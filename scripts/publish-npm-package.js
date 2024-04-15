
const fse = require('fs-extra')
require('dotenv').config()
const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const path = require('path')

const publishPackage = async function () {
    const rootDir = path.join(__dirname, '..')
    const packageDir = path.join(rootDir, 'dist/npm')
    const readmeSourcePath = path.join(__dirname, 'npm-package-readme.md')
    const readmeTargetPath = path.join(packageDir, 'README.md')

    try {
        // Check if the .env file exists
        const accessToken = process.env.NPM_TOKEN
        if (!accessToken) {
            throw new Error('NPM access token is not set in .env file.')
        }

        console.log('  Setting up npm authentication...')
        const originalDirectory = process.cwd()
        process.chdir(packageDir)

        // Create .npmrc file with the access token in the package directory
        const npmrc = [
            'registry=https://registry.npmjs.org/',
            `//registry.npmjs.org/:_authToken=${ accessToken }`
        ].join('\n')
        fse.writeFileSync('.npmrc', npmrc)

        // Copy the README.md file to the package directory
        await fse.copyFile(readmeSourcePath, readmeTargetPath)

        // Publish the package
        console.log('  Publishing package...')
        const { stdout } = await exec('npm publish . --access=public')

        // Clean up and return to the original directory
        fse.unlinkSync('.npmrc')
        process.chdir(originalDirectory)

        console.log('  Publishing success:', stdout)
    } catch (error) {
        console.error('Publishing failed:', error)
    }

    console.log('Publishing package: Done')
}

publishPackage()
