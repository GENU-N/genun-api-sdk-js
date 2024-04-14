
/**
 * Web3Auth helper
 * Note: Web3Auth SDK should load via script tag in the HTML file, like this:
 * <script src="https://cdn.jsdelivr.net/npm/@web3auth/modal@7.3.1/dist/modal.umd.min.js"></script>
 * If not so, ethers can't sign the EIP-712 message through Web3Auth,
 * at least in the version of Web3Auth 7.x.
 */

import { v4 as uuidv4 } from 'uuid'
import { ethers } from 'ethers'

import EIP712 from './EIP712'


/**
 * Get signature from Web3Auth
 * @param {Object} options
 * @param {string} options.clientId Your client ID from the Web3Auth project dashboard
 * @param {string} options.chainId Chain ID which you want to connect
 * @param {string} options.rpcTarget RPC Url for the chain
 * @param {string} options.web3AuthNetwork Web3Auth network
 * @returns {Promise<{ id: string, account: string, timestamp: number, signature: string }>}
 * @throws {Error}
 */
export const getSignatureFromWeb3Auth = async function ({
    clientId,
    chainId,
    rpcTarget,
    web3AuthNetwork,
}) {
    const web3auth = new window.Modal.Web3Auth({
        clientId: clientId,
        chainConfig: {
            chainNamespace: 'eip155',
            chainId,
            rpcTarget,
        },
        web3AuthNetwork,
    })
    await web3auth.initModal()
    const web3authProvider = await web3auth.connect()
    const provider = new ethers.BrowserProvider(web3authProvider)
    const signer = await provider.getSigner()
    const address = await signer.getAddress()
    const account = address.toLowerCase()

    const value = {
        id: uuidv4(),
        account,
        timestamp: Math.floor(Date.now() / 1000),
    }

    const message = ethers.TypedDataEncoder.getPayload(EIP712.domain, EIP712.types, value)
    const params = [account, JSON.stringify(message)]
    const method = 'eth_signTypedData_v4'
    const signature = await signer.provider.send(method, params)
    // web3auth.logout()

    return {
        ...value,
        signature,
    }
}
