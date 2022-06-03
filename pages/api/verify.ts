import type { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'
import { users } from '../../utils/users'

type Data = {
  authenticated: boolean
}

export default function auth(req: NextApiRequest, res: NextApiResponse<Data>) {
  let authenticated = false

  const address = req.query.address as string
  const signature = req.query.signature as string

  const user = users[address]

  if(user) {
    const decodedAddress = ethers.utils.verifyMessage(user.nonce.toString(), signature)
    
    if(address.toLowerCase() === decodedAddress.toLowerCase()) authenticated = true
  }
  
  res.status(200).json({ authenticated })
}