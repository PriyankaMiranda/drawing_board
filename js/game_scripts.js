if (!document.cookie) {
  window.location.href = '/';
}
// if unique id is assigned, allow them to be in the game, else, send back to lobby
/*
if(){

}
*/

// ------------------------------------------------------------------------------------
// --------------------------------initialize variables--------------------------------
// ------------------------------------------------------------------------------------
var socket = io();
var FADE_TIME = 150; // ms
var TYPING_TIMER_LENGTH = 10; // ms
var COLORS = ["#008b8b","#006060","#1b7742","#002627","#3477db","#870c25","#d50000","#d24d57",
              "#aa2e00","#d35400","#aa6b51","#554800","#1c2833","#34515e","#4b6a88","#220b38",
              "#522032","#7d314c","#483d8b","#77448b","#8a2be2","#a74165","#9b59b6","#db0a5b"];
var $window = $(window);
var $messages = $(".messages"); // Messages area
var $inputMessage = $(".inputMessage"); // Input message input box
var $chatPage = $(".chat.page"); // The chatroom page
var typing = false;
var lastTypingTime;
var username;
var img;
var gameID;
var score = 0;
var word = "___";
const cookie_val = document.cookie;

try{
  username = cookie_val.split("name=")[1].split(";")[0];
  img = cookie_val.split("img=")[1].split(";")[0];
  gameID = cookie_val.split("gameID=")[1].split(";")[0];
  gamePWD = cookie_val.split("game-pwd=")[1].split(";")[0];
}
catch{
  window.location.href = "/";
}

document.getElementById("gameID").innerHTML += gameID;
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------
//-------------------------------Set drawing board variables-------------------------------
//-----------------------------------------------------------------------------------------
var canvas = document.getElementsByClassName('whiteboard')[0];
var colors = document.getElementsByClassName('color pen');
let context = canvas.getContext("2d");
let rect = canvas.getBoundingClientRect();
var drawing = false;
var isChrome = !!window.chrome;
var isMobile = false;
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
  || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
  isMobile = true;
}
//-----------------------------------------------------------------------------------------  
//-----------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------
//---------------------Cascade of events based on entry for every user---------------------
//-----------------------------------------------------------------------------------------
var socket = io();

// hide currently used chars for other users in homepage 
socket.emit("hide chars reloading",{gameID:gameID,gamePWD:gamePWD});
// get chars from all users present in lobby to hide in homempage
socket.on("get chars", (data) => {
  if(gameID == data.gameID && gamePWD == data.gamePWD){
    socket.emit("send chars", {username:username,img:img,return_id:data.return_id,chars:data.chars,imgs:data.imgs});
  }
});

// load chars in lobby
socket.emit("load chars on game",{gameID:gameID,gamePWD:gamePWD,option:"not repeat"});   
// get chars from all users present in lobby
socket.on("get chars for game", (data) => {
  if(data.gameID == gameID && data.gamePWD == gamePWD){
    socket.emit("send chars for game", {username:username,img:img,gameID:gameID,gamePWD:gamePWD,option:data.option,socket_id:socket.id,score:score,word:word});
  }
});

setTimeout(function() {
    socket.emit("display chars on game",{gameID:gameID,gamePWD:gamePWD,option:"not repeat"});              
}, 1000)


// display all the details of the users present in lobby
socket.on("display chars game", (data) => {
  console.log(data.socket_ids)
  if(data.gameID == gameID && data.gamePWD == gamePWD){
    removeParticipantsImg();
    // removeReadyButton();
      console.log(data.chars)
      var ready_loc = 0
      while(data.chars[ready_loc] == 0 && data.imgs[ready_loc] == 0){
        ready_loc+=1
      }
      if (username == data.chars[ready_loc] && img == data.imgs[ready_loc]){
        // first user gets the ready button!
        // setReadyButton()
      }
      if(data.option == "not repeat"){
        updateChars()   
      }
      for (var i = 0; i < data.chars.length; i++) {
        if(data.chars[i]!= 0){
          addParticipantsImg({char: data.chars[i], img: data.imgs[i]});
        }
      }

  }
});


/*
socket.emit("load chars in game", {username: username, img: img , gameID:gameID});
try{
  uniqueID = cookie_val.split("uniqueID=")[1].split(";")[0];
  socket.emit("update client list - old user",{uniqueID:uniqueID, gameID:gameID, username: username, img:img});
}
catch{
  socket.emit("update client list - new user",{gameID:gameID, username: username, img:img});
}
*/
var time_val;


//-----------------------------------------------------------------------------------------  
//-----------------------------------------------------------------------------------------  

//-----------------------------------------------------------------------------------------
//-------------------------------Event listeners for drawing-------------------------------
//-----------------------------------------------------------------------------------------
canvas.addEventListener('mousedown', onMouseDown, false);
canvas.addEventListener('mouseup', onMouseUp, false);
canvas.addEventListener('mouseout', onMouseUp, false);
canvas.addEventListener('mousemove', throttle(onMouseMove, 1), false);
//Touch support for mobile devices
canvas.addEventListener('touchstart', onMouseDown, false);
canvas.addEventListener('touchend', onMouseUp, false);
canvas.addEventListener('touchcancel', onMouseUp, false);
canvas.addEventListener('touchmove', throttle(onMouseMove, 1), false);
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------
//--------------------------------Color params and functions-------------------------------
//-----------------------------------------------------------------------------------------
var current = {color: 'black', prev_color: 'black',lineWidth: 5};
for (var i = 0; i < colors.length; i++){
  colors[i].addEventListener('click', onColorUpdate, false);
}

function onColorUpdate(e){
  var all_colors = document.getElementsByClassName("color")
  for (var i = 0; i < all_colors.length; i++) {
    all_colors[i].style.border = "thick solid rgba(255, 255, 255, .5)"; 
  }
  current.prev_color = current.color;
  current.color = e.target.style.backgroundColor;
  current.lineWidth = 5;
  if (current.color == 'black'){
  e.target.style.border = "thick solid rgba(255, 255, 255, .5)";
  }else{
  e.target.style.border = "thick solid rgba(0, 0, 0, .5)";
  }
  if(current.color == 'white'){
    current.lineWidth = 45;
  }
  context.beginPath();
}
//-----------------------------------------------------------------------------------------  
//----------------------------------------------------------------------------------------- 

//-----------------------------------------------------------------------------------------
//--------------------------------------Pen selector---------------------------------------
//-----------------------------------------------------------------------------------------
document.getElementsByClassName("color pencil")[0].addEventListener('click', function (e){
  // refresh all borders
  var all_colors = document.getElementsByClassName("color")
  for (var i = 0; i < all_colors.length; i++) {
    all_colors[i].style.border = "thick solid rgba(255, 255, 255, .5)";
  }
  e.target.style.border = "thick solid rgba(0, 0, 0, .5)";
  if(current.color == 'white'){  
    if(current.prev_color == 'white'){
      current.color = 'black';
    }
    else{
      current.color = current.prev_color;  
    }
  }
  current.lineWidth = 5;
  context.beginPath();
});
//----------------------------------------------------------------------------------------- 
//-----------------------------------------------------------------------------------------  

//-----------------------------------------------------------------------------------------
//--------------------------------------Refresh screen-------------------------------------
//-----------------------------------------------------------------------------------------
document.getElementsByClassName("color refresh")[0].addEventListener('click', function (e){
  // refresh all borders
  var all_colors = document.getElementsByClassName("color")
  for (var i = 0; i < all_colors.length; i++) {
    all_colors[i].style.border = "thick solid rgba(255, 255, 255, .5)";
  }
  e.target.style.border = "thick solid rgba(0, 0, 0, .5)";
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.closePath();
  context.beginPath();
});
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------  

//-----------------------------------------------------------------------------------------
//------------------------------------drawing functions------------------------------------
//-----------------------------------------------------------------------------------------
function onMouseDown(e){
  e.preventDefault();
  e.stopPropagation();
  if(isChrome || isMobile){
    drawing = true;
  }
  else{
    if (drawing == false){
      drawing = true;
    }
    else{
      drawing = false;
    } 
  }
  if(typeof event.touches === 'undefined'){
    current.x = ((e.clientX - rect.left) / (rect.right - rect.left)) *canvas.width;
    current.y = ((e.clientY - rect.top) / (rect.bottom - rect.top)) *canvas.height;
  }
  else{
    current.x = ((e.touches[0].clientX - rect.left) / (rect.right - rect.left)) *canvas.width;
    current.y = ((e.touches[0].clientY - rect.top) / (rect.bottom - rect.top)) *canvas.height;
  }
}

function onMouseUp(e){
  e.preventDefault();
  e.stopPropagation();
  if (!drawing) { return; }
  if(isChrome|| isMobile){
  drawing = false;  
  }
}

function onMouseMove(e){
  e.preventDefault();
  e.stopPropagation();
  if (!drawing) { return; }
  if(typeof event.touches === 'undefined'){
    current.x_new = ((e.clientX - rect.left) / (rect.right - rect.left)) *canvas.width;
    current.y_new = ((e.clientY - rect.top) / (rect.bottom - rect.top)) *canvas.height;
  }
  else{
    current.x_new = ((e.touches[0].clientX - rect.left) / (rect.right - rect.left)) *canvas.width;
    current.y_new = ((e.touches[0].clientY - rect.top) / (rect.bottom - rect.top)) *canvas.height;
  }
  drawLine(current.x, current.y, current.x_new, current.y_new,  current.lineWidth, current.color, true);
  if(typeof event.touches === 'undefined'){
    current.x = ((e.clientX - rect.left) / (rect.right - rect.left)) *canvas.width;
    current.y = ((e.clientY - rect.top) / (rect.bottom - rect.top)) *canvas.height;
  }
  else{
    current.x = ((e.touches[0].clientX - rect.left) / (rect.right - rect.left)) *canvas.width;
    current.y = ((e.touches[0].clientY - rect.top) / (rect.bottom - rect.top)) *canvas.height;
  }
}

function onDrawingEvent(data){
  if(gameID == data.gameID && gamePWD == data.gamePWD){
    drawLine(data.x0 , data.y0 , data.x1 , data.y1 , data.lineWidth, data.color);
  }
}

function drawLine(x0, y0, x1, y1, lineWidth, color, emit){
  context.lineWidth = lineWidth;
  context.strokeStyle = color;
  context.beginPath();
  context.moveTo(x0,y0);
  context.lineTo(x1,y1);
  context.stroke();
  context.closePath();

  if (!emit) { return; }
  var w = canvas.width;
  var h = canvas.height;

  gameID = cookie_val.split("gameID=")[1].split(";")[0];

  socket.emit('drawing', {
    x0: x0 ,
    y0: y0 ,
    x1: x1 ,
    y1: y1 ,
    lineWidth: context.lineWidth ,
    color: color,
    gameID: gameID,
    gamePWD: gamePWD
  });
}

//to limit the number of events per second
function throttle(callback, delay) {
  var previousCall = new Date().getTime();
  return function() {
    var time = new Date().getTime();  
    if ((time - previousCall) >= delay) {
      previousCall = time;
      callback.apply(null, arguments);
    }
  };
}
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

/*

//-----------------------------------------------------------------------------------------
//-----------------------------------Chat functions----------------------------------------
//-----------------------------------------------------------------------------------------
// Sets the client's username
const setUsername = () => {
  // If the username is valid
  username = cookie_val.split("name=")[1].split(";")[0];
  img = cookie_val.split("img=")[1];
  // Tell the server your username
  var message = $inputMessage.val();
  // Prevent markup from being injected into the message
  message = cleanInput(message);
  gameID = cookie_val.split("gameID=")[1].split(";")[0];

  socket.emit("add user in game", { username: username, message: message, gameID:gameID});
};

// Sends a chat message
const sendMessage = () => {
  var message = $inputMessage.val();
  // Prevent markup from being injected into the message
  message = cleanInput(message);
  if (message) {
    $inputMessage.val("");
    gameID = cookie_val.split("gameID=")[1].split(";")[0];
    var dataval = { username: username, message: message, gameID:gameID };
    addChatMessage(dataval);
    socket.emit("new message in game", dataval);
    
    console.log("checking ans")

    socket.emit("check answer", {message: message, time_val:time_val, gameID:gameID});
  }
};

// Log a message
const log = (message, options) => {
  var $el = $("<p>")
    .addClass("log")
    .text(message);
  addMessageElement($el, options);
};

// Adds the visual chat message to the message list
const addChatMessage = (data, options) => {
  // Don't fade the message in if there is an 'X was typing'
  var $typingMessages = getTypingMessages(data);
  options = options || {};

  if ($typingMessages.length !== 0) {
    options.fade = false;
    $typingMessages.remove();
  }

  var $usernameDiv = $('<span class="username"/>').text(data.username).css("color", getUsernameColor(data.username));
  var $messageBodyDiv = $('<span class="messageBody">').text(" : "+data.message);
  var typingClass = data.typing ? "typing" : "";
  var $messageDiv = $('<p class="message"/>').data("username", data.username).addClass(typingClass).append($usernameDiv, $messageBodyDiv);
  addMessageElement($messageDiv, options);
};

// Adds the visual chat typing message
const addChatTyping = (data) => {
  data.typing = true;
  data.message = "is typing....";
  addChatMessage(data);
};

// Removes the visual chat typing message
const removeChatTyping = (data) => {
  getTypingMessages(data).fadeOut(function() {
    $(this).remove();
  });
};

// Adds a message element to the messages and scrolls to the bottom
// el - The element to add as a message
// options.fade - If the element should fade-in (default = true)
// options.prepend - If the element should prepend
//   all other messages (default = false)
const addMessageElement = (el, options) => {
  var $el = $(el);

  // Setup default options
  if (!options) {
    options = {};
  }
  if (typeof options.fade === "undefined") {
    options.fade = true;
  }
  if (typeof options.prepend === "undefined") {
    options.prepend = false;
  }

  // Apply options
  if (options.fade) {
    $el.hide().fadeIn(FADE_TIME);
  }
  if (options.prepend) {
    $messages.prepend($el);
  } else {
    $messages.append($el);
  }
  $messages[0].scrollTop = $messages[0].scrollHeight;
};

// Prevents input from having injected markup
const cleanInput = (input) => {
  return $("<div/>")
    .text(input)
    .html();
};

// Updates the typing event
const updateTyping = () => {
  if (!typing) {
    typing = true;
    username = cookie_val.split("name=")[1].split(";")[0];
    gameID = cookie_val.split("gameID=")[1].split(";")[0];
    socket.emit("typing in game", { username: username , gameID:gameID});
  }

  lastTypingTime = new Date().getTime();
  setTimeout(() => {
    var typingTimer = new Date().getTime();
    var timeDiff = typingTimer - lastTypingTime;
    if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
      socket.emit("stop typing in game",{gameID:gameID});
      typing = false;
    }
  }, TYPING_TIMER_LENGTH);
};

// Gets the 'X is typing' messages of a user
const getTypingMessages = (data) => {
  return $(".typing.message").filter(function(i) {
    return data.username;
  });
};

// Gets the color of a username through our hash function
const getUsernameColor = (username) => {
  // Compute hash code
  var hash = 7;
  for (var i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + (hash << 5) - hash;
  }
  // Calculate color
  var index = Math.abs(hash % COLORS.length);
  return COLORS[index];
};

// Keyboard events
$window.keydown((event) => {
  // When the client hits ENTER on their keyboard
  if (event.which === 13) {
    if (username) {
      sendMessage();
      socket.emit("stop typing in game",{gameID:gameID});
      typing = false;
    } else {
      setUsername();
      sendMessage();
    }
  }
});

$inputMessage.on("input", () => {
  updateTyping();
});

// Focus input when clicking on the message input's border
$inputMessage.click(() => {
  $inputMessage.focus();
});
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------
//-------------------------------Load participants functions-------------------------------
//-----------------------------------------------------------------------------------------
const removeParticipantsImg = (data) => {
  var parent = document.getElementById("row_chars");
  while (parent.firstChild) parent.removeChild(parent.firstChild);
};

const addParticipantsImg = (data) => {
    var parent = document.getElementById("row_chars");

    var char_div = document.createElement("DIV");
    char_div.className = "characters";
    char_div.style.flex = "25%";
    char_div.style.padding = "20px";
    char_div.style.opacity = 1;
    char_div.style.transform = "scale(1)";
    parent.appendChild(char_div);

    var image = document.createElement("IMG");
    image.className = "characters_img";
    image.src = data.img;
    image.style.width = "80%";
    image.style.height = "80%";
    char_div.appendChild(image);

    var div_form = document.createElement("FORM");
    div_form.className = "characters_form";
    div_form.style.textAlign = "center";
    div_form.style.fontStyle = "italic";
    div_form.style.fontFamily = "cursive";
    char_div.appendChild(div_form);

    var div_label = document.createElement("LABEL");
    div_label.className = "characters_label";
    div_label.innerHTML = data.char;
    div_form.appendChild(div_label);

    if(isMobile){
      char_div.style.maxWidth = "150px";
      char_div.style.maxHeight = "150px";
      div_label.style.fontSize = "20px";
    }else{
      char_div.style.maxWidth = "100px";
      char_div.style.maxHeight = "100px";
      div_label.style.fontSize = "10px";
    }
};
//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------
*/
//-----------------------------------------------------------------------------------------
//--------------------------------------Socket events--------------------------------------
//-----------------------------------------------------------------------------------------
socket.on('drawing', onDrawingEvent); 

// Whenever the server emits 'new message', update the chat body
socket.on("new message in game", (data) => {
  gameID = cookie_val.split("gameID=")[1].split(";")[0];
  if(gameID == data.gameID){
  addChatMessage(data);
  }
});

// Whenever the server emits 'user joined', log it in the chat body
socket.on("user joined in game", (data) => {
  gameID = cookie_val.split("gameID=")[1].split(";")[0];
  if(gameID == data.gameID){
  addChatMessage(data);
  }
});

// Whenever the server emits 'user left', log it in the chat body
socket.on("user left game", (data) => {
  gameID = cookie_val.split("gameID=")[1].split(";")[0];
  if(gameID == data.gameID){
  removeChatTyping(data);
  }
});

// Whenever the server emits 'typing', show the typing message
socket.on("typing in game", (data) => {
  gameID = cookie_val.split("gameID=")[1].split(";")[0];
  if(gameID == data.gameID){
  addChatTyping(data);
  }
});

// Whenever the server emits 'stop typing', kill the typing message
socket.on("stop typing in game", (data) => {
  gameID = cookie_val.split("gameID=")[1].split(";")[0];
  if(gameID == data.gameID){
  removeChatTyping(data);
  }
});

socket.on("disconnect in game", () => {  
  log("you have been disconnected");
});

socket.on("reconnect in game", () => {
  log("you have been reconnected");
  if (username) {
    gameID = cookie_val.split("gameID=")[1].split(";")[0];
    socket.emit("add user in game", {username:username, gameID:gameID});
  }
});

socket.on("get chars for game", (data) => {
  if(data.gameID == gameID){
    socket.emit("send chars for game", { username: username, img: img, gameID:gameID});
  }
});

socket.on("get chars for reloading", () => {
  socket.emit("send chars for homepage", {username: username, img: img ,gameID:gameID});
});

socket.on("get chars for reloading upon disconnection in game", () => {
  socket.emit("reload chars for others not the one that left in game");
});

socket.on("reload chars upon disconnection in game", () => {
  socket.emit("reload chars for others except the one that left in game", {username: username, img: img,gameID:gameID});  
});

socket.on("display chars in game", (data) => {
  if(data.gameID == gameID){
    removeParticipantsImg();
    username = cookie_val.split("name=")[1].split(";")[0];
    img = cookie_val.split("img=")[1].split(";")[0];
    for (var i = 0; i < data.chars.length; i++) {
      addParticipantsImg({ char: data.chars[i], img: data.imgs[i] });
    }   
  }

});


socket.on("get game characters", () => {
  socket.emit("send game character")
  if(data.gameID == gameID){
    socket.emit("send chars for game", {id:socket.id, username: username, img: img, gameID:gameID});
  }
});

var client_data = []

socket.on("update my data for everyone", (data) => {
    socket.emit("update my data for everyone", data.my_data_current);
});

socket.on("operations",(data)=>{
    socket.emit("operations",data.my_data_current);
});

socket.on("set my client data list", (data) => {
    client_data = data.client_data; 
    socket.emit("check if update is required", {client_data:client_data});
});

socket.on("update client data list", (data) => {
    client_data = data.client_data;
});

socket.on("get existing client data list", (data) => {
    socket.emit("return client data list", {client_data:client_data,id:data.return_address,uniqueID:data.uniqueID});
});

socket.on("return client data list", (data) => {
    socket.emit("return client data list", data);
});

socket.on("send unique id", (data) => {
  document.cookie = "uniqueID=" + data.id;
});


socket.on("update client list contents",(data)=>{
  socket.emit("update client list contents", {id:socket.id, username: username, img: img, gameID:gameID})
});


socket.on("done updating client list",(data)=>{
    //------------------------------------------ 
    //------------------------------------------
    // socket.emit("save client list", data);
    //------------------------------------------
    //------------------------------------------
});


socket.on("update timer",(data)=>{
  if(data.timeleft <=  5){
    document.getElementById("timer").style.color = "#BE2625";
  }
  else{
    document.getElementById("timer").style.color = "#005582";
  }
  time_val = data.timeleft;
  document.getElementById("timer").innerHTML = data.timeleft;
});

socket.on("show word data",(data)=>{
  document.getElementById("word").innerHTML = data.word;
 });


socket.on("show correct answer",(data)=>{
  var overlay = document.getElementsByClassName("overlay")[0]
  while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
  overlay.style.display = "block";
  var para = document.createElement("p");
  para.style.fontSize = "30px";
  para.innerHTML = "Answer: "+data.ans;
  overlay.appendChild(para);
  setTimeout(function(){ overlay.style.display = "none"; }, 2000);
});

socket.on("match score with username and img", (data) => {
    socket.emit("sending score", {id:data.id,username:username,img:img});
});

socket.on("match score with username and img 2", (data) => {
    socket.emit("sending score", {id:data.id,username:data.username,img:data.img});
});

socket.on("get score with username and img", (data) => {
    socket.emit("sending score 2", {return_id : data.return_id, id : socket.id, username : username, img : img});
});

socket.on("send score", (data) => {
    socket.emit("send score", data);
});

socket.on("leader board", (data) => {
  console.log("fgrg")

  setTimeout(function(){ 

  var para = document.createElement("h1");
  para.innerHTML = "Leaderboard ";
  document.getElementsByClassName("login-form")[0].appendChild(para);
  var content = document.createElement("a");
  content.innerHTML = data;
  document.getElementsByClassName("login-form")[0].appendChild(content);

  document.getElementsByClassName("leaderboard-overlay")[0].style.width = "100%";

  }, 2000);

});


//-----------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------


























// ------------------------------------------------------------------------------------
// -----------------------------------Socket Events------------------------------------
// ------------------------------------------------------------------------------------
// if user clicks ready button, all current users enter the game through this emit 
socket.on("enter game", (data) => {
  if(data.gameID == gameID &&data.gamePWD == gamePWD){
    window.location.href = "/game";
  }
});

// Whenever the server emits 'new message', update the chat body
socket.on("new message", (data) => {
  addChatMessage(data);
});

// Whenever the server emits 'typing', show the typing message
socket.on("typing", (data) => {
  addChatTyping(data);
});

// Whenever the server emits 'stop typing', kill the typing message
socket.on("stop typing", (data) => {
  removeChatTyping(data);
});

socket.on("send error", () => {
  window.location.href = "/";  
});

socket.on("disconnect", () => {
  log("you have been disconnected");  
});

socket.on("reconnect", () => {
  log("you have been reconnected");
});

socket.on("get chars for reloading", () => {
  socket.emit("send chars for homepage", {username: username, img: img });
});

socket.on("get chars for reloading upon disconnection", () => {
  socket.emit("reload chars for others not the one that left");
});

socket.on("reload chars upon disconnection", () => {
  socket.emit("reload chars for others except the one that left", {username: username, img: img});  
});

// ------------------------------------------------------------------------------------
// -----------------------------Keyboard and Click Events------------------------------
// ------------------------------------------------------------------------------------
$window.keydown((event) => {
  // When the client hits ENTER on their keyboard, update message for everyone
  if (event.which === 13) {
    sendMessage();
    socket.emit("stop typing ", {gameID:gameID,gamePWD:gamePWD});
    typing = false;
  }
});

$inputMessage.on("input", () => {
  updateTyping();
}); 

// Focus input when clicking on the message input's border
$inputMessage.click(() => {
  $inputMessage.focus();
});
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------


// ------------------------------------------------------------------------------------
// --------------------------load chars in lobby every 3 secs--------------------------
// ------------------------------------------------------------------------------------
function updateChars() {         
  setTimeout(function() {
      // refresh the lobby chars 
      socket.emit("load chars on lobby",{gameID:gameID,gamePWD:gamePWD,username: username, img: img, option:"repeat"}); 
      setTimeout(function() {
          socket.emit("display chars on lobby",{gameID:gameID,gamePWD:gamePWD, option:"repeat"});              
      }, 1000)
      updateChars()                 
  }, 2000)
}
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------
// ---------------------------removes old participant images---------------------------
// ------------------------------------------------------------------------------------
const removeParticipantsImg = (data) => {
  var parent = document.getElementById("row_chars");
  while (parent.firstChild) parent.removeChild(parent.firstChild);
};

// ------------------------------------------------------------------------------------
// ----------------------------shows all current partiipants---------------------------
// ------------------------------------------------------------------------------------
const addParticipantsImg = (data) => {
  var parent = document.getElementById("row_chars");

  var char_div = document.createElement("DIV");
  char_div.className = "characters";
  char_div.style.maxWidth = "150px";
  char_div.style.maxHeight = "150px";
  char_div.style.flex = "25%";
  char_div.style.padding = "40px";
  char_div.style.opacity = 1;
  char_div.style.transform = "scale(1)";
  parent.appendChild(char_div);

  var image = document.createElement("IMG");
  image.className = "characters_img";
  image.src = data.img;
  image.style.width = "100%";
  image.style.height = "100%";
  char_div.appendChild(image);

  var div_form = document.createElement("FORM");
  div_form.className = "characters_form";
  div_form.style.textAlign = "center";
  div_form.style.fontStyle = "italic";
  div_form.style.fontFamily = "cursive";
  char_div.appendChild(div_form);

  var div_label = document.createElement("LABEL");
  div_label.className = "characters_label";

  div_label.style.fontSize = "30px";
  div_label.innerHTML = data.char;
  div_form.appendChild(div_label);
};

// ------------------------------------------------------------------------------------
// --------------------------------sends a chat message--------------------------------
// ------------------------------------------------------------------------------------
const sendMessage = () => {
  var message = ' '+$inputMessage.val();
  // Prevent markup from being injected into the message
  message = cleanInput(message);
  if (message) {
    $inputMessage.val("");
    var dataval = { username: username, message: message , gameID: gameID, gamePWD: gamePWD};
    addChatMessage(dataval);
    socket.emit("new message", dataval);
  }
};

// ------------------------------------------------------------------------------------
// --------------------------------structures chat message--------------------------------
// ------------------------------------------------------------------------------------
// Adds the visual chat message to the message list
const addChatMessage = (data) => {
  if(data.gameID == gameID && data.gamePWD == gamePWD){
    // Don't fade the message in if there is an 'X was typing'
    var $typingMessages = getTypingMessages(data);

    if ($typingMessages.length !== 0) {
      $typingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>')
    .text(data.username)
    .css("color", getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">').text(data.message);

    var typingClass = data.typing ? "typing" : "";
    var $messageDiv = $('<p class="message"/>')
    .data("username", data.username)
    .addClass(typingClass)
    .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv);
    return $messageDiv
  }
};

// Gets the 'X is typing...' messages of a user
const getTypingMessages = (data) => {
  return $(".typing.message").filter(function(i) {
    return data.username;
  });
};

// Adds a message element to the messages and scrolls to the bottom
// el - The element to add as a message
// options.fade - If the element should fade-in (default = true)
// options.prepend - If the element should prepend
//   all other messages (default = false)
const addMessageElement = (el, options) => {
  var $el = $(el);
  // Setup default options
  if (!options) {
    options = {};
  }
  if (typeof options.fade === "undefined") {
    options.fade = true;
  }
  if (typeof options.prepend === "undefined") {
    options.prepend = false;
  }

  // Apply options
  if (options.fade) {
    $el.hide().fadeIn(FADE_TIME);
  }
  if (options.prepend) {
    $messages.prepend($el);
  } else {
    $messages.append($el);
  }
  $messages[0].scrollTop = $messages[0].scrollHeight;

};


// Adds the visual chat typing message
const addChatTyping = (data) => {
  if(data.gameID == gameID && data.gamePWD == gamePWD){
    data.typing = true;
    data.message = "is typing....";
    addChatMessage(data).fadeOut(function() {
      $(this).remove();
    });
  }
};

// Removes the visual chat typing message
const removeChatTyping = (data) => {
  if(data.gameID == gameID && data.gamePWD == gamePWD){
    getTypingMessages(data);
  }
};

// Updates the typing event
const updateTyping = () => {
  if (!typing) {
    typing = true;
    socket.emit("typing", { username: username ,gameID:gameID, gamePWD:gamePWD});
  }

  lastTypingTime = new Date().getTime();
  setTimeout(() => {
    var typingTimer = new Date().getTime();
    var timeDiff = typingTimer - lastTypingTime;
    if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
      socket.emit("stop typing", {gameID:gameID, gamePWD:gamePWD});
      typing = false;
    }
  }, TYPING_TIMER_LENGTH);
};

// ------------------------------------------------------------------------------------
// ----------------------------------Utility functions---------------------------------
// ------------------------------------------------------------------------------------
// Log a message
const log = (message, options) => {
  var $el = $("<p>").addClass("log").text(message);
  addMessageElement($el, options);
};

// Prevents input from having injected markup
const cleanInput = (input) => {
  return $("<div/>").text(input).html();
};

// Gets the color of a username through our hash function
const getUsernameColor = (username) => {
  // Compute hash code
  var hash = 7;
  for (var i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + (hash << 5) - hash;
  }
  // Calculate color
  var index = Math.abs(hash % COLORS.length);
  return COLORS[index];
};
// ------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------


