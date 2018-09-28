let app = {
  init: function () {
    window.sanitizer = jSanity.sanitize;
    $('.submit').on('submit', this.handleSubmit);
  },
  send: function (message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.la.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },
  fetch: function () {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: undefined,
      type: 'GET',
      // data: JSON.stringify(),
      // contentType: 'application/json',
      success: function () {
        console.log('chatterbox: Message sent');
      },
      error: function () {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  clearMessages: function() {
    $('#chats').html('');
  },
  renderMessage: function(message) {
    var {username, text, roomname} = message;
    var messageNode = $.parseHTML(`<div id ="message"> </div>`);
    var usernameNode = $.parseHTML(`<a href="" class="username"> ${_.escape(username)} </a>`)
    var textNode = $.parseHTML(`<p> ${_.escape(text)} </p>`);
    $(usernameNode).click(this.handleUsernameClick)
    $(messageNode).append(usernameNode);
    $(messageNode).append(textNode);
    

    $('#chats').prepend(messageNode);
    
},
  renderRoom: function(roomName) {
    $('#roomSelect').prepend(`<blink> ${roomName} </blink>`)
  },
  handleUsernameClick: function(){},

  handleSubmit: function(){
  
  }
};