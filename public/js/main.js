////"start": "node server",
//"dev":"nodemon server",

const chatForm = document.getElementById('chatform');
const chatMessages=document.querySelector('.chat-messages');
const roomName=document.getElementById('room-name');
const userList=document.getElementById('users');

//Get username and room from URL
const{username,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
});

const socket=io();

//Join Chatroom
socket.emit('joinRoom',{username,room});

//Get room and users
socket.on('roomUsers',({room,users})=>{
    outputRoomName(room);
    outputUsers(users);
});

socket.on('message',msgg=>{
console.log(msgg);
outputMessage(msgg);//Message from server

//Scroll down whenever there is new message automatically.
chatMessages.scrollTop=chatMessages.scrollHeight;
});

//Message Submit
chatform.addEventListener('submit',e=>{
e.preventDefault();//Prevents default behaviour of submitting form to a file.

const msg=e.target.elements.msg.value;
//Emitting message to server.
socket.emit('chatMessage',msg);

//Clears input
e.target.elements.msg.value='';
e.target.elements.msg.focus();
});

//Output message to DOM.
function outputMessage(message)
{
    const div=document.createElement('div');
    div.classList.add('message');
    div.innerHTML=`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName()
{
   roomName.innerText=room;
}

//Add Users to DOM
function outputUsers(users)
{
    userList.innerHTML=`${users.map(user => `<li>${user.username}</li>`).join('')}`;
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });