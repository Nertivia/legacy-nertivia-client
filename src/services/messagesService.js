import {instance, wrapper} from './Api';
import filesize from "filesize";
export default {
  // TODO: add ?continue=id
  get ( channelID )  {
    return wrapper(instance().get(`messages/${channelID}`));
  },

  post (channelID, data, onProgress) {
    const url = `messages/${channelID}`;

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