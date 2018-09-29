let app = {
  init: function () {

    $("#send").submit(false);

    $("#send").on("submit", function (event) {
      var textArea = event.currentTarget.children[0];
      var text = textArea.value;


      var parseUsername = function (sample) {
        var regExp = /=(\w+)/;
        var match = regExp.exec(sample);
        return match[1];
      };

      var roomname = $('#roomSelect').find(":selected").text();
      var username = parseUsername(window.location.search);

      this.handleSubmit(text, username, roomname);

    }.bind(this));

    this.fetch();


  },
  send: function (message) {
    var settings = {
      async: true,
      url: "http://parse.la.hackreactor.com/chatterbox/classes/messages",
      method: "POST",
      crossDomain: true,
      processData: false,
      contentType: 'application/json',
      data: JSON.stringify(message)
    };

    $.ajax(settings).done(function (response) {
      console.log(response);
      this.reFetch();

    }.bind(this));
  },
  fetch: function () {
    var settings = {
      async: true,
      crossDomain: true,
      url: "http://parse.la.hackreactor.com/chatterbox/classes/messages",
      method: "GET",
      data: { order: "-createdAt" }, // give me evewrything created sinnce this.results[0].createdAt
    };

    console.log($.ajax(settings).done(
      function (response) {
        this.results = response.results;
        this.findAllActiveRooms();
        this.renderRoom();
        setInterval(this.reFetch.bind(this), 10000);
      }.bind(this)
    ));
  },
  reFetch: function () {
    var settings = {
      async: true,
      crossDomain: true,
      url: "http://parse.la.hackreactor.com/chatterbox/classes/messages",
      method: "GET",
      data: {
        order: "-createdAt",
        where: JSON.stringify({
          createdAt: { 
            $gt: { 
              __type: "Date", 
              iso: this.results[0].createdAt,
            } 
          }
        }),
        //where={"createdAt":{"$gte":{ "__type": "Date", "iso": "2018-09-29T19:57:07.406Z" }}}
      }
    };

    $.ajax(settings).done(
      function (response) {
        // add new results to results array

        var newReponse = response.results;
        console.log('this is the response object from the server at :', (new Date()).toLocaleTimeString(), newReponse);
        
        for (let i = 0; i < newReponse.length; i++) {
          this.results.unshift(newReponse[i]);
          this.renderMessage(newReponse[i], true);
        }
        // iterate all elements in  new response 
        // for (let i = 0; i < newReponse.length; i++) {
        //   if (newReponse[i].text !== justSaid) {
        //     if (Date.parse(newReponse[i].createdAt) > lastCreatedTime && newReponse[i].objectId !== this.results[0].objectId) {
        //       var justSaid = newReponse[i].text
        //       this.renderMessage(newReponse[i], true);
        //       console.log(newReponse[i].createdAt)
        //     } else if (newReponse.length === newReponse.length - 1) {

        //     }
        //   }
        // }
        // render that element
        // this.findAllActiveRooms();
        // this.renderRoom();
        //setInterval(this.refresh.bind(this), 5000);
      }.bind(this)
    );
  },
  clearMessages: function () {
    $("#chats").html("");
  },
  renderMessage: function (message, shouldPrepend) {
    var { username, text, roomname } = message;
    var messageNode = $.parseHTML(`<div id ="message"> </div>`);
    var usernameNode = $.parseHTML(
      `<a href="" class="username"> ${_.escape(username)} </a>`
    );

    if (this.friends.includes(username)) {
      console.log("hello")
      messageNode.css({ "font-weight": "bold" });
    }

    var textNode = $.parseHTML(`<p> ${_.escape(text)} </p>`);

    $(usernameNode).on("click", function (event) {
      event.preventDefault();
      var username = event.currentTarget.text;
      this.handleUsernameClick(username);
    }.bind(this));

    $(messageNode).append(usernameNode);
    $(messageNode).append(textNode);
    if (shouldPrepend === true) {
      $("#chats").prepend(messageNode);
    } else {
      $("#chats").append(messageNode);
    }

  },

  findAllActiveRooms: function () {
    this.activeRooms = [];
    for (var i = 0; i < this.results.length; i++) {
      if (!this.activeRooms.includes(this.results[i].roomname)) {
        this.activeRooms.push(this.results[i].roomname);
      }
    }
  },

  renderRoom: function (roomName) {
    for (let i = 0; i < this.activeRooms.length; i++) {
      $("#roomSelect").append(
        `<option value="${_.escape(this.activeRooms[i])}">${_.escape(this.activeRooms[i])}</option>`
      );
    }
    // TODO make it so that if you have more than one room
    // you can actually switch between them.
    for (let i = 0; i < this.results.length; i++) {
      if (_.escape(this.results[i].roomname)) {
        this.renderMessage(this.results[i]);
      }
    }
  },
  friends: [],
  handleUsernameClick: function (username) {
    if (!this.friends.includes(username)) {
      this.friends.push(username);
    }
  },

  handleSubmit: function (text, username, roomname) {
    var message = {};
    message.text = text;
    message.username = username;
    message.roomname = roomname;
    this.send(message);
  }
};
