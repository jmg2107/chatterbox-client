// YOUR CODE HERE:

var app = {
  server : 'https://api.parse.com/1/classes/chatterbox',
  room : [],
  users : [],
  init : function(){},
  send : function(message){
    $.ajax({
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Sending message. Data: ', data);
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
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message retrieve. Data: ', data);
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
    var $user = $("<div class='username'><a href='#'>" + message['username'] + "</a></div>");
    var $message =  $("<div>" + message['text'] + "</div>");

    $container.append($user).append($message);
    $("#chats").append($container);
  },
  addRoom : function(room){
    var $room = $("<div>" + room + "</div>");
    this.room.push(room);
    $("#roomSelect").append($room);
  },
  addFriend : function(){
    app.users.push($(document).closest(".username").text());
    console.log(app.users);
    console.log($(this));
  },
  handleSubmit : function(){

  }
};

$( document ).on( "click", ".username", function() {
  app.addFriend();
});
$( document ).on( "submit", "#send .submit", function() {
  app.handleSubmit();
});
$( document ).on( "click", "#refresh", function() {
  app.fetch();
});


