import { instance, wrapper } from "./Api";

const config = require("../config.js");

let domain = "";
if (config.serverURL) domain = config.serverURL + "/";

export default {
  post(data) {
    return wrapper(instance().post(domain + "/settings/emoji", data));
  },
  delete(emojiID) {
    return wrapper(
      instance().delete(domain + `/settings/emoji`, { data: { emojiID } })
    );
  },
  put(data) {
    return wrapper(
      instance().put(domain + `/settings/emoji`, {
        emojiID: data.emojiID,
        name: data.name
      })
    );
  }
};
