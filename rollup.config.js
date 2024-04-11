const fs = require('fs')
const path = require('path')
const copy = require('rollup-plugin-copy')
const glob = require('glob')
const json = require('@rollup/plugin-json')
const resolve = require('@rollup/plugin-node-resolve').default
const commonjs = require('@rollup/plugin-commonjs')
const { terser } = require('rollup-plugin-terser')
const { babel } = require('@rollup/plugin-babel')
const peerDepsExternal = require('rollup-plugin-peer-deps-external')

const pkg = require('./package.json')

const umdFilename = 'token-gating-client-sdk.umd.min.js'

// Custom Rollup plugin to add a version number
const addVersionToFilename = (version) => {
    return {
        name: 'add-version-to-filename',
        writeBundle(options, bundle) {
            for (const fileName of Object.keys(bundle)) {
                if (fileName.endsWith('.js') || fileName.endsWith('.js.map')) {
                    // Add a version number for .js and .js.map files
                    const versionedName = fileName.replace(/(\.min)?\.js(\.map)?$/, `.${version}\$1.js\$2`)
                    const latestName = fileName.replace(/(\.min)?\.js(\.map)?$/, `.latest\$1.js\$2`)
                    const oldPath = path.join(options.dir || path.dirname(options.file), fileName)
                    const versionedPath = path.join(options.dir || path.dirname(options.file), versionedName)
                    const latestPath = path.join(options.dir || path.dirname(options.file), latestName)

                    // Copy the file to create a versioned file
                    fs.copyFileSync(oldPath, versionedPath)

                    // Copy the file to create one that points to the latest version
                    fs.copyFileSync(oldPath, latestPath)

                    // If it's a JavaScript file, update the referenced source map filename
                    if (fileName.endsWith('.js')) {
                        const code = fs.readFileSync(oldPath, 'utf8')
                        const versionedSourceMapComment = `//# sourceMappingURL=${versionedName}.map`
                        const latestSourceMapComment = `//# sourceMappingURL=${latestName}.map`

                        // Update the code to include the new source map comment
                        const versionedCode = code.replace(/\/\/# sourceMappingURL=.+\.map/, versionedSourceMapComment)
                        fs.writeFileSync(versionedPath, versionedCode)

                        // Update the code to point to the latest file's source map
                        const latestCode = code.replace(/\/\/# sourceMappingURL=.+\.map/, latestSourceMapComment)
                        fs.writeFileSync(latestPath, latestCode)
                    }
                }
            }

            // Delete the original *.umd.min.js file and the corresponding .map file
            const originalFilePath = path.join(options.dir || path.dirname(options.file), umdFilename)
            const originalMapPath = `${originalFilePath}.map`

            if (fs.existsSync(originalFilePath)) {
                fs.unlinkSync(originalFilePath)
            }
            if (fs.existsSync(originalMapPath)) {
                fs.unlinkSync(originalMapPath)
            }
        },
    }
}


const basePlugins = [
    peerDepsExternal(),
    json(),
    resolve(),
    commonjs(),
    babel({
        babelHelpers: 'runtime',
        exclude: 'node_modules/**',
        presets: [
            [
                '@babel/preset-env',
                {
                    useBuiltIns: 'usage',
                    corejs: 3,
                },
            ],
        ],
        plugins: [
            '@babel/plugin-transform-runtime',
        ],
    }),
]

module.exports = [
    // MetaMask UMD configuration
    {
        input: 'src/metamask/index.js',
        external: [
            '@metamask/detect-provider',
            '@metamask/sdk',
            'ethers',
        ],
        output: {
            name: 'GENUNMetaMask',
            file: 'dist/genun.metamask.umd.min.js',
            format: 'umd',
            sourcemap: process.env.NODE_ENV === 'development',
            globals: {
                '@metamask/detect-provider': 'detectEthereumProvider',
                '@metamask/sdk': 'MetaMaskSDK',
                'ethers': 'ethers',
            },
        },
        plugins: [
            ...basePlugins,
            terser(),
            addVersionToFilename(pkg.version),
        ],
    },
    // SDK UMD configuration
    {
        input: 'src/sdk/index.js',
        external: [
            'axios',
        ],
        output: {
            name: 'GENUNClient',
            file: 'dist/genun.sdk.umd.min.js',
            format: 'umd',
            sourcemap: process.env.NODE_ENV === 'development',
            globals: {
                'axios': 'axios',
            },
        },
        plugins: [
            ...basePlugins,
            terser(),
            addVersionToFilename(pkg.version),
        ],
    },
];
