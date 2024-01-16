const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    msg:{
        type:String,
        required:[true,'message is required to initiate a chat']
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    // group:{}
},{
    timestamps:true
})

module.exports = mongoose.model("Message",messageSchema)