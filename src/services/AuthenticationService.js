import { instance, wrapper } from "./Api";

export default {
  register(credentials) {
    return wrapper(instance().post("user/register", credentials));
  },
  login(credentials) {
    return wrapper(instance().post("user/login", credentials));
  },
  logout() {
    return wrapper(instance().delete("user/logout"));
  },
  user() {
    return wrapper(instance().get("user"));
  }
};
