require('dotenv').config()

import mongoose from 'mongoose'

const ModelSchema = new mongoose.Schema({
    info: {
        id: String,
        createdAt: Number,
        recievedAt: Number,

        room: String,
        status: String
    },
    data: {
        serverId: String
    }
})

const uri = process.env.MONGO_URI || process.env.MONGODB_URI
if (!uri)
    throw 'No value was found for MONGO_URI - make sure .env is setup correctly!'

mongoose.connect(uri, { useNewUrlParser: true })
const collection = mongoose.model('Portal', ModelSchema)
export default collection
