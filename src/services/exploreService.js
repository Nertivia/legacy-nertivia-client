import { instance, wrapper } from "./Api";

const config = require("../config.js");

let domain = "";
if (config.serverURL) domain = config.serverURL + "/";

export default {
  // servers
  getServersList(params) {
    return wrapper(instance().get(domain + `explore/servers${params || ""}`));
  },
  getServer(server_id) {
    return wrapper(instance().get(domain + `explore/servers/${server_id}`));
  },
  deleteServer(server_id) {
    return wrapper(instance().delete(domain + `explore/servers/${server_id}`));
  },
  updateServer(server_id, data) {
    return wrapper(
      instance().patch(domain + `explore/servers/${server_id}`, data)
    );
  },
  addServersList(data) {
    return wrapper(instance().post(domain + `explore/servers`, data));
  },

  // themes
  getThemes() {
    return wrapper(instance().get(domain + `explore/themes`));
  },
  getTheme(id, css) {
    return wrapper(
      instance().get(
        domain + `explore/themes/${id}${css === false ? "?css=false" : ""}`
      )
    );
  },
  addTheme(id, data) {
    return wrapper(instance().post(domain + `explore/themes/${id}`, data));
  },
  updateTheme(id, data) {
    return wrapper(instance().patch(domain + `explore/themes/${id}`, data));
  },
  applyTheme(id) {
    return wrapper(instance().get(domain + `explore/themes/${id}/apply`));
  },
};
