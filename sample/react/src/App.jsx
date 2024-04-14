
import { useState } from 'react'
import './App.css'

// Import the GENUNClient SDK
import GENUNClient from '@genun/client-sdk'
import {
    getSignatureFromMetaMask,
} from './Helper/MetaMask'
import {
    getSignatureFromWeb3Auth,
} from './Helper/Web3Auth'


function App () {
    // Used for init GENUNClient
    const [domain, setDomain] = useState('')
    const [apiKey, setApiKey] = useState('')
    const [genunClient, setGenunClient] = useState(null)
    const [hasLoggedIn, setHasLoggedIn] = useState(false)
    const [loginResult, setLoginResult] = useState(null)

    const handleDomainChange = (event) => {
        setDomain(event.target.value)
    }

    const handleApiKeyChange = (event) => {
        setApiKey(event.target.value)
    }

    const initializeClient = () => {
        const newClient = new GENUNClient({
            domain: domain,
            apiKey: apiKey,
            loginRequiredHook() {
                // Handle the logic when the API returns that user
                // authentication is required to access the API.
                console.log('You need to log in to continue')
            },
            timeout: 10000,
        })
        setGenunClient(newClient)
    }

    const logout = async function () {
        try {
            if (!hasLoggedIn) {
                return
            }
            await genunClient.auth.logout()
            setHasLoggedIn(false)
        } catch (error) {
            console.error('Failed to logout:', error)
        }
    }

    const loginWithMetaMask = async function () {
        try {
            await logout()

            const {
                id,
                account,
                signature,
                timestamp,
            } = await getSignatureFromMetaMask()
            const result = await genunClient.auth.loginWithWallet({
                id,
                account,
                timestamp,
                signature,
                walletType: 2, // MetaMask
            })
            setHasLoggedIn(true)
            setLoginResult(result)
        } catch (error) {
            setLoginResult({ error: error.message })
            console.log('loginWithMetaMask error:', error)
        }
    }

    /**
     * Your should replace the Web3AuthConfig with your own configuration.
     * The configuration is from the Web3Auth project dashboard.
     * @see https://web3auth.io
     */
    const Web3AuthConfig = {
        clientId: 'your_web3auth_client_id',
        chainId: 'your_chain_id',
        rpcTarget: 'your_rpc_target',
        web3AuthNetwork: 'your_web3auth_network',
    }
    const loginWithWeb3Auth = async function () {
        try {
            await logout()

            const {
                id,
                account,
                signature,
                timestamp,
            } = await getSignatureFromWeb3Auth(Web3AuthConfig)
            const result = await genunClient.auth.loginWithWallet({
                id,
                account,
                timestamp,
                signature,
                walletType: 4, // Web3Auth
            })
            setHasLoggedIn(true)
            setLoginResult(result)
        } catch (error) {
            setLoginResult({ error: error.message })
            console.log('loginWithWeb3Auth error:', error)
        }
    }

    return (
        <div className="app-container">
            <h1>GENU.N Open Platform SDK for JavaScript Example</h1>
            <h2>Login with MetaMask or Web3Auth</h2>
            <div className="input-group">
                <label>
                    <span>Domain:</span>
                    <input type="text" value={domain} onChange={handleDomainChange} />
                </label>
            </div>
            <div className="input-group">
                <label>
                    <span>API Key:</span>
                    <input type="text" value={apiKey} onChange={handleApiKeyChange} />
                </label>
            </div>
            <div className="button-group">
                <button
                    onClick={initializeClient}
                    disabled={!domain || !apiKey}
                    className="initialize-button"
                >
                    Initialize GENUN Client
                </button>
                <button
                    onClick={loginWithMetaMask}
                    disabled={!genunClient}
                    className="login-button"
                >
                    Login via MetaMask
                </button>
                <button
                    onClick={loginWithWeb3Auth}
                    disabled={!genunClient}
                    className="login-button"
                >
                    Login via Web3Auth
                </button>
            </div>
            {loginResult && (
                <div className="login-result">
                    <h3>Login Result:</h3>
                    <pre>{JSON.stringify(loginResult, null, 2)}</pre>
                </div>
            )}
        </div>
    )
}

export default App
