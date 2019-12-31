import { instance, wrapper } from "./Api";

export default {
  get(uniqueID) {
    return wrapper(instance().get(`user/${uniqueID}`));
  },
  update(data) {
    return wrapper(instance().patch(`user`, data));
  },
  getSurvey() {
    return wrapper(instance().get("/user/survey"));
  },
  setSurvey(data) {
    return wrapper(instance().put("/user/survey", data));
  },
  skipSurvey() {
    return wrapper(instance().delete("/user/survey/skip"));
  }
};
