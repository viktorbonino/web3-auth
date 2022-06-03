import type { NextApiRequest, NextApiResponse } from 'next'
import { users } from '../../utils/users'

export default function auth(req: NextApiRequest, res: NextApiResponse) {
  const address = req.query.address as string
  const action = req.query.action as string

  let user

  if(action === 'signup') {
    users[address] = {
      address,
      nonce: Math.floor(Math.random() * 10000000)
    }
  } else {
    user = users[address]
  }

  res.status(200).json({ user, users })  
}
