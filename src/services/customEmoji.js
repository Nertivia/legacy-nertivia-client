import { instance, wrapper } from "./Api";

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
    return wrapper(instance().post(url, data, config));
  },
  delete(emojiID) {
    return wrapper(instance().delete(`/settings/emoji`, { data: { emojiID } }));
  },
  put(data) {
    return wrapper(
      instance().put(`/settings/emoji`, {
        emojiID: data.emojiID,
        name: data.name
      })
    );
  }
};
