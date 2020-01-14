import { instance, wrapper } from "./Api";

const config = require('../config.js');

let domain = "";
if (config.serverURL) domain = config.serverURL+"/"

export default {
  post(data, onProgress) {
    const url = `/settings/emoji`;
    let config = {
      onUploadProgress(progressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );

        // execute the callback
        if (onProgress) onProgress(percentCompleted);

        return percentCompleted;
      }
    };
    return wrapper(instance().post(domain+url, data, config));
  },
  delete(emojiID) {
    return wrapper(instance().delete(domain+`/settings/emoji`, { data: { emojiID } }));
  },
  put(data) {
    return wrapper(
      instance().put(domain+`/settings/emoji`, {
        emojiID: data.emojiID,
        name: data.name
      })
    );
  }
};
