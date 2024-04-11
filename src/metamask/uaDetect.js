
const UAParser = require('ua-parser-js')


const {
    browser,
    cpu,
    device,
    engine,
    os,
    ua,
} = UAParser(window.navigator.userAgent)

const isMobile = device.type === 'mobile'
const isIOS = os.name === 'iOS'
const isAndroid = os.name === 'Android'


module.exports = {
    browser,
    cpu,
    device,
    engine,
    os,
    ua,
    isAndroid,
    isIOS,
    isMobile,
}
