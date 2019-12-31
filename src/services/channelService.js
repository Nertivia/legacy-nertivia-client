import { instance, wrapper } from "./Api";

export default {
  post(uniqueID) {
    return wrapper(instance().post(`channels/${uniqueID}`));
  },
  delete(channelID) {
    return wrapper(instance().delete(`channels/${channelID}`));
  }
};
