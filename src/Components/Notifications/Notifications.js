import React, { Component } from "react";
import Sidebar from "../Sidebar/Sidebar";
import fcm from "fcm-notification";
let serviceAccount = require("../Common/service-account.json");
let FCM = new fcm(serviceAccount);

let message = {
  data: {
    score: "850",
    time: "2:45",
  },
  notification: {
    title: "Title of notification",
    body: "Body of notification",
  },
  token: localStorage.getItem("token"),
};

console.log(localStorage.getItem("token"));
class Notifications extends Component {
  state = {};

  sendNotification = () => {
    FCM.send(message, function (err, response) {
      if (err) {
        console.log("error found", err);
      } else {
        console.log("response here", response);
      }
    });
  };
  render() {
    return (
      <Sidebar>
        <h1 onClick={this.sendNotification}>Notifications</h1>
      </Sidebar>
    );
  }
}

export default Notifications;
