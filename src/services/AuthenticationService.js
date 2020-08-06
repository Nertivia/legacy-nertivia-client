import { instance, wrapper } from "./Api";

const config = require("../config.js");

let domain = "";
if (config.serverURL) domain = config.serverURL + "/";

export default {
  register(credentials) {
    return wrapper(instance().post(domain + "user/register", credentials));
  },
  confirmEmail(email, code) {
    return wrapper(
      instance().post(domain + "user/register/confirm", { email, code })
    );
  },
  login(credentials) {
    return wrapper(instance().post(domain + "user/login", credentials));
  },
  resetPassword(credentials) {
    return wrapper(instance().post(domain + "user/reset/request", credentials));
  },
  resetPasswordCode(code, password, uniqueID) {
    return wrapper(
      instance().post(domain + `user/reset/code/${code}`, {
        password,
        uniqueID
      })
    );
  },
  logout() {
    return wrapper(instance().delete(domain + "user/logout"));
  },
  user() {
    return wrapper(instance().get(domain + "user"));
  }
};
