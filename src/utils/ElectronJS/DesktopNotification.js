module.exports = {
  directMessage({ username, avatarURL, message, open }) {
    let myNotification = new Notification(`${username}`, {
      body: message,
      icon: avatarURL,
      silent: true
    });
    myNotification.onclick = () => {
      open();
      console.log("CLICK");
      window.focus();
    };
    myNotification.onclose = () => {
      myNotification = null;
    };
  },
  serverMessage({
    serverName,
    channelName,
    username,
    avatarURL,
    message,
    serverID,
    bus
  }) {
    let myNotification = new Notification(
      `${username} in ${serverName}#${channelName}`,
      {
        body: message,
        icon: avatarURL,
        silent: true
      }
    );
    myNotification.onclick = () => {
      bus.$emit("openServer", serverID);
      window.focus();
    };
    myNotification.onclose = () => {
      myNotification = null;
    };
  }
};
