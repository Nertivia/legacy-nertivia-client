import { instance, wrapper } from "./Api";

const config = require("../config.js");

let domain = "";
if (config.serverURL) domain = config.serverURL + "/";

export default {
  post(channelID) {
    return wrapper(instance().post(domain + `messages/${channelID}/typing`));
  }
};
