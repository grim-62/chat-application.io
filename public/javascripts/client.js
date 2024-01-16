var socket = io();

socket.emit('join-server', loggedInUsername)

document.querySelector("#notif-cut").addEventListener("click",()=>{
  document.querySelector(".notif-box").style.display = "none"
})

var inputbox = document.querySelector("#inputmsg")
inputbox.addEventListener("keypress",(event)=>{
    if(event.key === "Enter" && inputbox.value !== "" ){
        sender(inputbox.value);
        inputbox.value = "";
      }
})

var sender = (msg)=>{
  var chatArea = document.querySelector(".chat-container");
    chatArea.innerHTML +=  `<div class="message-box my-message">
                              <p>${msg}</p>
                            </div>`
    
    const msgObject ={
      message:msg,
      receiver:currentChattingUser,
      sender:loggedInUserId
    }   
    socket.emit('privateMessage', msgObject)                        
}

var receive = (msg)=>{
  if(!msg)
    return
  var chatArea = document.querySelector(".chat-container");
  const tamplate = `<div class="message-box friend-message">
                      <p>${msg}</p>
                    </div>`
  chatArea.innerHTML += tamplate                  
                   
}
 
var openChat = (img,username,chatId)=>{
    document.querySelector(".right-side").style.display = "block";
    document.querySelector("#current-ChatDp").setAttribute('src', img);
    document.querySelector("#current-chat-Username").innerHTML = username;
    currentChattingUser = chatId;

    socket.emit('get-Message',{
      receivingUser:currentChattingUser,
      sendingUser:loggedInUserId
    })

}

var appendChat = (chatId,img,username,lastmsg)=>{
    var chats = document.querySelector(".chat-list")
    const template = `<div id="user_${chatId}" class="chat-box hover:bg-slate-600" onclick="openChat('${img}','${username}','${chatId}')">
    <div class="img-box">
      <img class="img-cover" src="${img}" alt="">
    </div>
    <div class="chat-details">
      <div class="text-head">
        <h4>${username}</h4>
        <p class="time unread">11:49</p>
      </div>
      <div class="text-message">
        <p><q>${lastmsg}</q></p>
        <b>1</b>
      </div>
    </div>
  </div>`
  if(!chats.querySelector(`#user_${chatId}`)){
    chats.innerHTML += template
  }
}

socket.on('newUserJoin',(users)=>{
    appendChat(users.id,users.img,users.username,users.lastMessage);
});

socket.on('recievePrivateMessage',msg =>{
  receive(msg);
});

socket.on('chat-Message', allmsgs =>{
  allmsgs.forEach( msg => {
    if(msg.sender == loggedInUserId){
      sender(msg.msg);
    } else{
      receive(msg.msg)
    }
    
  });
})