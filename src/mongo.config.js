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

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
const collection = mongoose.model('Portal', ModelSchema)
export default collection
