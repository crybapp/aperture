require('dotenv').config()

import { connect, model } from 'mongoose'

connect(process.env.MONGO_URI, { useNewUrlParser: true })
const collection = model('Portal')
export default collection
