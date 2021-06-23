import mongoose from "mongoose";

const imessageSchema = mongoose.Schema({
    chatName: String,
    jsId: String,
    recId: String,
    conversation: [
        {
            message: String,
            timestamp: String,
            user: {
                displayName: String,
                email: String,
                photo: String,
                uid: String
            }
        }
    ]
})

export default mongoose.model('conversations', imessageSchema)
