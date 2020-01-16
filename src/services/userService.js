import { instance, wrapper } from "./Api";

const config = require("../config.js");

let domain = "";
if (config.serverURL) domain = config.serverURL + "/";

export default {
  get(uniqueID) {
    return wrapper(instance().get(domain + `user/${uniqueID}`));
  },
  update(data) {
    return wrapper(instance().patch(domain + `user`, data));
  },
  getSurvey() {
    return wrapper(instance().get(domain + "/user/survey"));
  },
  setSurvey(data) {
    return wrapper(instance().put(domain + "/user/survey", data));
  },
  skipSurvey() {
    return wrapper(instance().delete(domain + "/user/survey/skip"));
  }
};
