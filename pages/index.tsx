import { useState, useEffect } from 'react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { ethers } from 'ethers'
import useAuth from '../hooks/useAuth'

const Home: NextPage = () => {
  const [balance, setBalance] = useState('')
  const [successfulSignUp, setSuccessfullSignUp] = useState(false)
  const { connection, connect, loggedIn, signIn, signUp, account, notSignedUp } = useAuth()

  const router = useRouter()

  useEffect(() => {
    if(loggedIn && connection) {
      const provider = new ethers.providers.Web3Provider(connection as any)
      provider.getBalance(account).then((balance) => {
        setBalance(ethers.utils.formatEther(balance))
       })
    }
  }, [loggedIn, connection, account])

  const onSignUp = async () => {
    const user = await signUp()
    if(user) setSuccessfullSignUp(true)
  }

  return (
    <div className="flex flex-col px-16 py-8 gap-8 justify-center">
      <h1 className="font-extrabold text-center text-transparent text-4xl bg-clip-text bg-gradient-to-r from-purple-700 to-orange-700">
        Eidoo Code Assignment
      </h1>

      {successfulSignUp && !loggedIn && 
        <span className="text-4xl text-center text-green-500">
          Successfully signed up!
        </span>
      }

      {!connection && 
        <button 
          className="bg-orange-500 p-4 rounded-lg text-white font-medium hover:bg-orange-600" 
          onClick={connect}
        > 
          Connect Wallet
        </button>
      }

      {connection && !loggedIn &&
        <div className="flex flex-col gap-8">
          {notSignedUp && 
            <h2 className="text-4xl text-center text-red-500">
              You are not signed up yet.
            </h2>
          }
          <div className="flex flex-row gap-4 justify-center">
            <button
              className="bg-purple-700 p-4 px-8 rounded-lg text-white font-medium hover:bg-purple-800"
              onClick={onSignUp}
            >
              Sign Up
            </button>
            <button
              className="bg-orange-700 p-4 px-8 rounded-lg text-white font-medium hover:bg-orange-800" 
              onClick={signIn}
            >
              Sign In
            </button>
          </div>
        </div>
      }

      {loggedIn &&
        <div className="flex flex-col gap-8 items-center">
          <span className="p-4 rounded-xl font-extrabold text-center text-white text-xs bg-gradient-to-r from-purple-700 to-orange-700 md:text-3xl">
            {account}
          </span>
          <span className="font-extrabold text-center break-normal text-transparent text-2xl bg-clip-text bg-gradient-to-r from-purple-700 to-orange-700 md:text-3xl">
            Your ETH balance is {balance}
          </span>
          <button
            className="bg-purple-700 p-4 px-8 rounded-lg text-white font-medium hover:bg-purple-800"
            onClick={() => router.reload()}
          >
            Logout
          </button>
        </div>
      }
    </div>
  )
}

export default Home
