const {readFileSync} = require('fs');
const login = require("facebook-chat-api");

loginPath = {appState: JSON.parse(readFileSync(__dirname + "/appstate.js","utf-8"))};
var credentials = {
    email: "az9906159@gmail.com",
    password: "Abcd!!1234",
  };
  

  login({email: "haiaoc09@gmail.com", password: "Abcd!!1234"}, (err, api) => {
      if(err) return console.error(err);
      // Here you can use the api
  });
