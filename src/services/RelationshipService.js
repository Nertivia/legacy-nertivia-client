import { instance, wrapper } from "./Api";

const config = require("../config.js");

let domain = "";
if (config.serverURL) domain = config.serverURL + "/";

export default {
  post(friend) {
    return wrapper(instance().post(domain + "/user/relationship", friend));
  },
  put(uniqueID) {
    return wrapper(instance().put(domain + "/user/relationship", { uniqueID }));
  },
  delete(uniqueID) {
    return wrapper(
      instance().delete(domain + "/user/relationship", {
        data: { uniqueID }
      })
    );
  }
};
