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
        this.findAllActiveRooms();
        this.renderRoom();
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

  findAllActiveRooms: function() {
   this.activeRooms = [];
   for (var i = 0; i < this.results.length; i++) {
      if (!this.activeRooms.includes(this.results[i].roomname)) {
        this.activeRooms.push(this.results[i].roomname);
      } 
   }
  },

  renderRoom: function(roomName) {
    
    for (let i = 0; i < this.activeRooms.length; i++) {
      $("#roomSelect").prepend(`<option value="${this.activeRooms[i]}">${this.activeRooms[i]}</option>`);
    };
    // TODO make it so that if you have more than one room
    // you can actually switch between them.
    for (let i = 0; i < this.results.length; i++){
    if (this.results[i].roomname){
        this.renderMessage(this.results[i])
    }
  }
  
  },



  handleUsernameClick: function() {},

  handleSubmit: function() {}
};

app.init()