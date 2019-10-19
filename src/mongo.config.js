require('dotenv').config()

import mongoose from 'mongoose'

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
const collection = mongoose.model('Portal')
export default collection
