
const fse = require('fs-extra')
const path = require('path')
const pick = require('lodash/pick')


const buildModule = async function () {
    console.log('Build NPM package: Start')

    const moduleName = 'genun-client-sdk'

    const rootDir = path.resolve(__dirname, '..')
    const distDir = path.resolve(rootDir, 'dist')
    // const sourceCodeDir = path.join(rootDir, 'src/sdk')

    const moduleBaseDir = path.join(distDir, 'npm')
    const moduleCodeDir = path.join(moduleBaseDir, 'src')
    const builtFilesDir = 'dist'
    const targetDistDir = path.join(moduleBaseDir, builtFilesDir)
    const cjsFilename = `${ moduleName }.cjs.js`
    const esmFilename = `${ moduleName }.esm.js`
    const umdFilename = `${ moduleName }.umd.min.js`
    const originPackageFilepath = path.resolve(rootDir, 'package.json')
    const packageFilepath = path.join(moduleBaseDir, 'package.json')

    const originalPackageJson = require(originPackageFilepath)
    const pickingFields = [
        'name',
        'version',
        'description',
        'keywords',
        'author',
        'license',
        'homepage',
        'repository',
        'bugs',
        'peerDependencies',
        'dependencies',
    ]
    const modulePackage = {
        ...pick(originalPackageJson, pickingFields),
        main: `${ builtFilesDir }/${ cjsFilename }`,
        module: `${ builtFilesDir }/${ esmFilename }`,
        'umd:main': `${ builtFilesDir }/${ umdFilename }`,
        files: [
          `${ builtFilesDir }/*`,
        ],
    }

    await fse.ensureDir(moduleBaseDir)
    await fse.ensureDir(targetDistDir)
    await fse.writeJson(packageFilepath, modulePackage, {
        spaces: 2,
    })
    await fse.copy(path.join(distDir, cjsFilename), path.join(targetDistDir, cjsFilename))
    await fse.copy(path.join(distDir, esmFilename), path.join(targetDistDir, esmFilename))
    await fse.copy(path.join(distDir, umdFilename), path.join(targetDistDir, umdFilename))
    // await fse.copy(sourceCodeDir, moduleCodeDir)

    console.log('  package.json for distribution has been generated.')
    console.log('Build NPM package: Done')
}


buildModule()
