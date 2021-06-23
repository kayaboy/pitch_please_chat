import express from 'express';
import mongoose from 'mongoose';
import Pusher from "pusher";
import cors from 'cors';

import mongoData from "./mongoData.js";

const app = express()
const port = process.env.PORT || 9000

const pusher = new Pusher({
    appId: "1222502",
    key: "aaca110194e03e7b0484",
    secret: "d59b383a83e3a7d6d2a7",
    cluster: "ap1",
    useTLS: true
});

app.use(cors())
app.use(express.json())

//db
const mongoURI = 'mongodb+srv://kimmyphua:acess123@cluster0.te8qa.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(mongoURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

mongoose.connection.once('open', () => {
    console.log('DB connected')

    const changeStream = mongoose.connection.collection('conversations').watch()

    changeStream.on('change', (change) => {
        if (change.operationType === 'insert') {
            pusher.trigger('chats', 'newChat', {
                'change': change
            })
        } else if (change.operationType === 'update') {
            pusher.trigger('messages', 'newMessage', {
                'change': change
            })
        } else {
            console.log('Error triggering pusher...')
        }
    })
})

//api
app.get('/', (req, res) => res.status(200).send('Hello!'))

app.post('/new/conversation', (req, res) => {
    const dbData = req.body
    console.log(req.body)

    mongoData.create(dbData, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(201).send(data)
            console.log(data)
        }
    })
})

app.post('/new/message', (req, res) => {
    mongoData.updateOne(
        {_id: req.query.id},
        {$push: {conversation: req.body, jsId: req.query.jsId, recId: req.query.recId}},
        (err, data) => {
            if (err) {
                console.log("Error sending message...")
                console.log(err)
                res.status(500).send(err)
            } else {
                res.status(202).send(data)
            }
        })
})

app.get('/get/conversationList', (req, res) => {
    mongoData.find((err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            data.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });

            let conversations = []

            data.map((conversationData) => {
                const conversationInfo = {
                    id: conversationData._id,
                    name: conversationData.chatName,
                    timestamp: conversationData.conversation[0].timestamp
                }
                conversations.push(conversationInfo)
            })
            res.status(200).send(conversations)
        }
    })
})

app.get('/get/conversation', (req, res) => {
    const id = req.query.id

    mongoData.find({_id: id}, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.get('/get/lastMessage', (req, res) => {
    const id = req.query.id

    mongoData.find({_id: id}, (err, data) => {
        if (err) {
            res.status(500).send(err)
        } else {
            let convData = data[0].conversation

            convData.sort((b, a) => {
                return a.timestamp - b.timestamp;
            });

            res.status(200).send(convData[0])
        }
    })
})


//listen
app.listen(port, () => console.log(`Connected to localhost:${port}`))
