require('dotenv').config()

import mongojs from 'mongojs'

const db = mongojs(process.env.MONGODB_URI, ['portals'])
export default db