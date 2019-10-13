require('dotenv').config()

import mongojs from 'mongojs'

const db = mongojs(process.env.MONGODB_URI, ['servers'])
export default db