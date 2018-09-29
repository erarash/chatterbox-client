let app = {
  init: function() {

    window.sanitizer = jSanity.sanitize;
    $("#send").submit(false);
    $("#send").on("submit",function(event){
      event.preventDefault();
      this.handleSubmit();
    })
    //$(".submit").on("submit", this.handleSubmit);
    this.fetch();
  },
  send: function(message) {
    var settings = {
      async: true,
      url: "http://parse.la.hackreactor.com/chatterbox/classes/messages",
      method: "POST",
      crossDomain: true,
      processData: false,
      contentType: 'application/json',
      data: JSON.stringify(message)
    };

    $.ajax(settings).done(function(response) {
      console.log(response);
      this.handleSubmit();

    }.bind(this));
  },
  fetch: function() {
    var settings = {
      async: true,
      crossDomain: true,
      url: "http://parse.la.hackreactor.com/chatterbox/classes/messages",
      method: "GET",
      data: { order: "-createdAt" }
    };

    $.ajax(settings).done(
      function(response) {
        this.results = response.results;
        this.findAllActiveRooms();
        this.renderRoom();
      }.bind(this)
    );
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

    $("#chats").append(messageNode);
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
      $("#roomSelect").append(
        `<option value="${this.activeRooms[i]}">${this.activeRooms[i]}</option>`
      );
    }
    // TODO make it so that if you have more than one room
    // you can actually switch between them.
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].roomname) {
        this.renderMessage(this.results[i]);
      }
    }
  },

  handleUsernameClick: function() {},

  handleSubmit: function() {

    console.log('ayoooooo')
  }
};

app.init();
