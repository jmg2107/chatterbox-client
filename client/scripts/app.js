// YOUR CODE HERE:

var app = {
  server : 'https://api.parse.com/1/classes/chatterbox',
  room : [],
  username : "teamwinner",
  users : {},
  init : function(){

    app.fetch();
  },
  send : function(message){
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Sending message. Data: ', data);
        app.fetch();
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message. Error: ', data);
      }
    });
  },
  fetch : function(){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'GET',
      data: { order: '-createdAt' },
      contentType: 'application/json',
      success: function (data) {
        app.clearMessages();
        var arr = data.results;
        console.log('chatterbox: Message retrieve. Data: ', data);
        for (var i = 0; i < arr.length; i++) {
          //check if message is in the room, and print it
          if(arr[i]["roomname"] === $("#roomSelect").find(":selected").text()){
            app.addMessage(arr[i]);
          }
          if (app.room.indexOf(arr[i]["roomname"]) === -1 && arr[i]["roomname"]) {
            app.addRoom(arr[i]["roomname"].replace(/[&<>]/g));
          }

        }
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to retrieve message. Error: ', data);
      }
    });
  },
  clearMessages : function(){
    $("#chats").empty();
  },
  addMessage : function(message){
    var $container = $("<div></div>");

    if((message['username'] !== undefined) && (message['text'] !== undefined)){

      var $user = $("<div class='username'><a href='#'>" + message['username'].replace(/[&<>]/g, "") + "</a></div>");
      //if user from message is in users{}
      //then, add friend class to div
      if(message['username'] in app.users){

        var $message =  $("<div class='friend'>" + message['text'].replace(/[&<>]/g, "") + "</div>");
      } else {
      //else add div normally
      var $message =  $("<div>" + message['text'].replace(/[&<>]/g, "") + "</div>");
      }

      $container.append($user).append($message);
      $("#chats").append($container);

    }
  },
  addRoom : function(room){
    var $room = $("<option>" + room + "</option>");
    this.room.push(room);
    $("#roomSelect").append($room);
  },
  addFriend : function(){
    app.users[$(this).text()] = 1;
    app.fetch();

  },
  handleSubmit : function(){

    var enterRoom = $("#roomSelect").find(":selected").text();

    if($("#roomSelect").find(":selected").text() === "New room..."){
      var room;
      while(room === undefined){
        room = prompt("Room Name: " );
      }
      var enterRoom = room.replace(/[&<>]/g, "");
      if(app.room.indexOf(enterRoom) <= -1){
        app.addRoom(enterRoom);
      }
    }

    var msg = {
      roomname : enterRoom,
      text : $("#message").val(),
      username : app.username
    };
    console.log(msg);

    app.send(msg);
  }
};

$( document ).ready(function(){
  app.init();
});
$( document ).on( "click", ".username", function() {
  app.addFriend.bind(this)();
});
$( document ).on( "submit", "#send", function(event) {
  event.preventDefault();
  app.handleSubmit();
});
$( document ).on( "click", "#refresh", function() {
  app.fetch();
});
$( document ).on( "change", "#roomSelect", function() {
  app.fetch();
});

