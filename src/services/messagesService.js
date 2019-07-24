import {instance, wrapper} from './Api';
import filesize from "filesize";
export default {
  // TODO: add ?continue=id
  get ( channelID )  {
    return wrapper(instance().get(`messages/channels/${channelID}`));
  },
  delete ( messageID, channelID )  {
    return wrapper(instance().delete(`messages/${messageID}/channels/${channelID}`));
  },
  update ( messageID, channelID, data )  {
    return wrapper(instance().patch(`messages/${messageID}/channels/${channelID}`, data));
  },

  post (channelID, data, onProgress) {
    const url = `messages/channels/${channelID}`;

    var start = +new Date();

    let config = {
      onUploadProgress(progressEvent) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);

        // execute the callback
        if (onProgress) onProgress(percentCompleted)

        return percentCompleted;
      },
    };
    
    return wrapper(instance().post(url, data, config));

  } 
}