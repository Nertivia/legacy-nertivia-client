import { instance, wrapper } from "./Api";

const config = require('../config.js');

let domain = "";
if (config.serverURL) domain = config.serverURL+"/"

export default {
  post(uniqueID) {
    return wrapper(instance().post(domain+`channels/${uniqueID}`));
  },
  delete(channelID) {
    return wrapper(instance().delete(domain+`channels/${channelID}`));
  }
};
