module.exports = {
  directMessage({ username, avatarURL, message }) {
    let myNotification = new Notification(`${username}`, {
      body: message,
      icon: avatarURL,
      silent: true
    });
    myNotification.onclick = () => {
      console.log("CLICK");
    };
    myNotification.onclose = () => {
      myNotification = null;
    };
  },
  serverMessage({ serverName, channelName, username, avatarURL, message }) {
    let myNotification = new Notification(
      `${username} in ${serverName}#${channelName}`,
      {
        body: message,
        icon: avatarURL,
        silent: true
      }
    );
    myNotification.onclick = () => {
      console.log("CLICK");
    };
    myNotification.onclose = () => {
      myNotification = null;
    };
  }
};
