
/**
 * Used for EIP-712 signing
*/

const EIP712 = {
    domain: {
        name: 'GENU.N Authentication',
        version: '1.0',
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
    },
    primaryType: 'Request',
    types: {
        Request: [
            { name: 'id', type: 'string' },
            { name: 'account', type: 'address' },
            { name: 'timestamp', type: 'uint256' },
        ],
    },
}


export default EIP712
