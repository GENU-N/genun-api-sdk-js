
/**
 * This script copies the generated React SDK example to the sample directory.
 * It also reads the .gitignore file in the source directory and ignores the files.
 */

const fse = require('fs-extra')
const ignore = require('ignore')
const path = require('path')


const copyDirectory = async function (srcDir, destDir) {
    console.log('Build React sample: Start')

    try {
        const ifSrcDirExists = await fse.pathExists(srcDir)
        if (!ifSrcDirExists) {
            console.log(`  Source directory does not exist: ${srcDir}`)
            return
        }

        const ig = ignore().add('.git')
        // Check if .gitignore file exists in the source directory
        const ifGitignoreExists = await fse.pathExists(path.join(srcDir, '.gitignore'))
        if (ifGitignoreExists) {
            // Read .gitignore file content
            const gitignoreContent = await fse.readFile(path.join(srcDir, '.gitignore'), 'utf8')
            // Use ignore library to parse the content of .gitignore file
            ig.add(gitignoreContent)
        }

        await fse.ensureDir(destDir)

        // Use fse.copy() to copy the directory
        await fse.copy(srcDir, destDir, {
            filter (src, dest) {
                // Check if the file should be ignored
                const relativePath = path.relative(srcDir, src)
                if (!relativePath) {
                    return true
                }
                return ig ? !ig.ignores(relativePath) : true
            }
        })

        console.log(`  Directory copied from ${srcDir} to ${destDir} successfully.`)
    } catch (err) {
        console.error(`  Failed to copy directory:\nDir: ${srcDir}\nDest: ${destDir}\nError:`, err)
    }

    console.log('Build React sample: Done')
}

const rootDir = path.resolve(__dirname, '..')
const srcDir = path.join(rootDir, '../genun-client-sdk-react-example')
const destDir = path.join(rootDir, 'sample', 'react')


copyDirectory(srcDir, destDir)
