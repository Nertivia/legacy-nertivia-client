import { instance, wrapper } from "./Api";

const config = require('../config.js');

let domain = "";
if (config.serverURL) domain = config.serverURL+"/"

export default {
  getTheme(id) {
    return wrapper(instance().get(domain+`themes/${id}`));
  },
  getThemes() {
    return wrapper(instance().get(domain+"themes/"));
  },
  save(data) {
    return wrapper(instance().post(domain+`themes/`, data));
  },
  update(data, id) {
    return wrapper(instance().patch(domain+`themes/${id}`, data));
  },
  delete(id) {
    return wrapper(instance().delete(domain+`themes/${id}`));
  }
};
