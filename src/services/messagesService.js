import { instance, wrapper } from "./Api";

const config = require('../config.js');

let domain = "";
if (config.serverURL) domain = config.serverURL+"/"

export default {
  // TODO: add ?continue=id
  get(channelID, continueMessageID, beforeMessageID, aroundMessageID) {
    return wrapper(
      instance().get(
        domain+`messages/channels/${channelID}${
          continueMessageID ? "?continue=" + continueMessageID
            : beforeMessageID ? "?before=" + beforeMessageID
            : aroundMessageID ? "?around=" + aroundMessageID
            : ""
        }`
      )
    );
  },
  delete(messageID, channelID) {
    return wrapper(
      instance().delete(domain+`messages/${messageID}/channels/${channelID}`)
    );
  },
  update(messageID, channelID, data) {
    return wrapper(
      instance().patch(domain+`messages/${messageID}/channels/${channelID}`, data)
    );
  },

  post(channelID, data, onProgress) {
    const url = `messages/channels/${channelID}`;

    //var start = +new Date();

    let config = {
      onUploadProgress(progressEvent) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        // execute the callback
        if (onProgress) onProgress(percentCompleted);

        return percentCompleted;
      }
    };

    return wrapper(instance().post(domain+url, data, config));
  },
  buttonClick(channelID, messageID, buttonID) {
    return wrapper(instance().post(domain+ `channels/${channelID}/messages/${messageID}/button/${buttonID}`));
  }
};
