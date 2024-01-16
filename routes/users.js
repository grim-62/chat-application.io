const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/Chatapp-Version-0-1")

const userSchema = mongoose.Schema({
  username:{
    type:String,
    required:[true,"uesrname is required to create a user"],
    unique:[true,"username must be unique"]
  },
  contact:{
    type:String,
  },
  dp:{
    type:String,
    default:"https://imgs.search.brave.com/TKFMHsr77tX5kpL-Ab4rGOr2ErKwUuTNmgfFaDhsWZE/rs:fit:500:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJzLmNvbS9p/bWFnZXMvaGQvbHVm/ZnktMTI3MC14LTEy/NzAtcGljdHVyZS1x/ODAzNGQxNnkzM296/NXljLmpwZw"
  },
  socketId:{
    type:String
  }
})

userSchema.plugin(plm)

module.exports = mongoose.model("user",userSchema)