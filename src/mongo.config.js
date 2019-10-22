require('dotenv').config()

import mongoose from 'mongoose'

const ServerSchema = new mongoose.Schema({
    info: {
        id: String,
        connectedAt: Number,

        portal: String
    }
})

const uri = process.env.MONGO_URI || process.env.MONGODB_URI
if (!uri)
    throw 'No value was found for MONGO_URI - make sure .env is setup correctly!'

mongoose.connect(uri, { useNewUrlParser: true })

const collection = mongoose.model('Server', ServerSchema)
export default collection
