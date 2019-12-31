import { instance, wrapper } from "./Api";

export default {
  uploadAvatar(data, onProgress) {
    const url = `/settings/avatar`;
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
    return wrapper(instance().post(url, data, config));
  }
};
