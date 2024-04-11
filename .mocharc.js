
const defaultSpec = 'test/**/*.test.js'
// const defaultSpec = 'test/my/*.test.js'
const spec = defaultSpec

module.exports = {
    file: [
        '.mocharc-global-setup.js',
        'test/setup.js',
    ],
    spec,
    jobs: 1,
    package: './package.json',
    parallel: false,
    reporter: 'spec',
    sort: true,
    timeout: '20000', // same as "timeout: '20s'"
    // timeout: false, // same as "timeout: 0"
    ui: 'bdd',
}
