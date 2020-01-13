import { instance, wrapper } from "./Api";

export default {
  post(data) {
    return wrapper(instance().post("/settings/emoji", data));
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
