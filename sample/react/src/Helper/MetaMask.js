
/**
 * MetaMask helper
 */

import { v4 as uuidv4 } from 'uuid'
import detectEthereumProvider from '@metamask/detect-provider'
import { ethers } from 'ethers'

import EIP712 from './EIP712'


/**
 * Get signature from MetaMask
 * @returns {Promise<{ id: string, account: string, timestamp: number, signature: string }>}
 * @throws {Error}
 */
export const getSignatureFromMetaMask = async function () {
    const _ethereum = window.ethereum || await detectEthereumProvider()
    if (!_ethereum) {
        throw new Error('Please install MetaMask and create wallet in MetaMask!')
    }
    if (!_ethereum.isMetaMask) {
        throw new Error('Please install MetaMask or set MetaMask as the default wallet!')
    }

    const [address] = await _ethereum.request({ method: 'eth_requestAccounts', params: []  })
    const account = address.toLowerCase()

    const value = {
        id: uuidv4(),
        account,
        timestamp: Math.floor(+new Date() / 1000),
    }

    const message = ethers.TypedDataEncoder.getPayload(EIP712.domain, EIP712.types, value)

    const signature = await _ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [
            account, JSON.stringify(message),
        ],
    })

    return {
        ...value,
        signature,
    }
}
