let app = {
  init: function() {
    window.sanitizer = jSanity.sanitize;
    $(".submit").on("submit", this.handleSubmit);
    this.fetch();
  },
  send: function(message) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: "http://parse.la.hackreactor.com/chatterbox/classes/messages",
      type: "POST",
      data: JSON.stringify(message),
      contentType: "application/json",
      success: function(data) {
        console.log("chatterbox: Message sent");
      },
      error: function(data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error("chatterbox: Failed to send message", data);
      }
    });
  },
  fetch: function() {
    
    var settings = {
      async: true,
      crossDomain: true,
      url: "http://parse.la.hackreactor.com/chatterbox/classes/messages",
      method: "GET",
      
    };

    $.ajax(settings).done(function(response) {
        this.results = response.results
        this.renderRoom('lobby');
    }.bind(this));

  },
  clearMessages: function() {
    $("#chats").html("");
  },
  renderMessage: function(message) {
    var { username, text, roomname } = message;
    var messageNode = $.parseHTML(`<div id ="message"> </div>`);
    var usernameNode = $.parseHTML(
      `<a href="" class="username"> ${_.escape(username)} </a>`
    );
    var textNode = $.parseHTML(`<p> ${_.escape(text)} </p>`);
    $(usernameNode).click(this.handleUsernameClick);
    $(messageNode).append(usernameNode);
    $(messageNode).append(textNode);

    $("#chats").prepend(messageNode);
  },

  renderRoom: function(roomName) {
    $("#roomSelect").prepend(`<option value="${roomName}">${roomName}</option>`);
    for (let i = 0; i < this.results.length; i++){
    if (this.results[i].roomname === 'lobby'){
        this.renderMessage(this.results[i])
    }
  }
  
  },



  handleUsernameClick: function() {},

  handleSubmit: function() {}
};

app.init()