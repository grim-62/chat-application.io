const passport = require('passport')
const io = require( "socket.io" )();
const socketapi = {
    io: io
};
const userModel = require('./routes/users');
const msgModel = require('./routes/messages')

// Add your socket.io logic here!
io.on( "connection", function( socket ) {
    
    socket.on('join-server',async username =>{

        const currentUser = await userModel.findOne({username:username}) 

        const onlineUsers = await userModel.find({
            socketId:{$nin:['']},
            username:{$nin:[currentUser.username]}
        })

        onlineUsers.forEach(onlineUser =>{
            socket.emit('newUserJoin',{
                img:onlineUser.dp,
                username:onlineUser.username,
                id:onlineUser._id,
                lastMessage:"gupt baat!"
            })
        })

        socket.broadcast.emit('newUserJoin',{
            img:currentUser.dp,
            username:currentUser.username,
            id:currentUser._id,
            lastMessage:"gupt baat!"
        })

        currentUser.socketId = socket.id;
        await currentUser.save();
        // console.log(currentUser)

    })

    socket.on('privateMessage',async msgObject =>{

    //    console.log(msgObject);
       
        await msgModel.create({
            msg:msgObject.message,
            receiver:msgObject.receiver,
            sender:msgObject.sender
        })
        const toUser = await userModel.findById(msgObject.receiver)
        io.to(toUser.socketId).emit('recievePrivateMessage', msgObject.message)
    })

    socket.on('get-Message',async userObject =>{
        const allMessage = await msgModel.find({
            $or:[
                {
                    sender:userObject.sendingUser,
                    receiver:userObject.receivingUser
                },
                {
                    receiver:userObject.receivingUser,
                    sender:userObject.sendingUser
                }
            ]
        })
        socket.emit('chat-Message', allMessage)
    })

    socket.on('disconnect', async () => {
        await userModel.findOneAndUpdate({
            socketId: socket.id
        }, {
            socketId: ""
        })
    })

    console.log( "A user connected" );
    
});
// end of socket.io logic

module.exports = socketapi;