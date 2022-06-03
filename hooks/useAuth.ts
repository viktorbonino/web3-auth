import { useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'

const useAuth = () => {
  const [account, setAccount] = useState('')
  const [connection, setConnection] = useState()
  const [loggedIn, setLoggedIn] = useState(false)
  const [notSignedUp, setNotSignedUp] = useState(false)

  async function getWeb3Modal() {
    const web3Modal = new Web3Modal({
      network: 'mainnet',
      cacheProvider: false,
    })
    return web3Modal
  }

  async function connect() {
    const web3Modal = await getWeb3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const accounts = await provider.listAccounts()

    setConnection(connection)
    setAccount(accounts[0])
  }

  async function signUp() {
    const user = await fetch(`/api/auth?address=${account}&action=signup`)
    const data = await user.json()
    setNotSignedUp(false)
    return data
  }

  async function signIn() {
    const authData = await fetch(`/api/auth?address=${account}`)
    const userData = await authData.json()

    if(userData.user) {
      const provider = new ethers.providers.Web3Provider(connection as any)
      const signer = provider.getSigner()
      const signature = await signer.signMessage(userData?.user?.nonce.toString())

      const response = await fetch(`/api/verify?address=${account}&signature=${signature}`)
      const data = await response.json()

      setLoggedIn(data.authenticated)
    } else {
      setNotSignedUp(true)
    }
  }

  return { account, connection, loggedIn, connect, signIn, signUp, notSignedUp }
}

export default useAuth