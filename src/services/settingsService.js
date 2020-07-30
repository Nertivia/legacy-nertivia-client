import { instance, wrapper } from "./Api";

const config = require("../config.js");

let domain = "";
if (config.serverURL) domain = config.serverURL + "/";

export default {
  setStatus(status) {
    return wrapper(instance().post(domain + "/settings/status", { status }));
  },
  setCustomStatus(custom_status) {
    return wrapper(
      instance().post(domain + "/settings/custom-status", { custom_status })
    );
  },
  GDriveURL() {
    return wrapper(instance().get(domain + "/settings/drive/url"));
  },
  GDriveAuth(code, token) {
    return wrapper(
      instance().post(domain + "/settings/drive/auth", { code, token })
    );
  },
  setApperance(apperance, boolean) {
    return wrapper(
      instance().put(domain + "/settings/apperance", {
        [apperance]: boolean
      })
    );
  },
  setServerPositions(ServerIDArr) {
    return wrapper(
      instance().put(domain + "/settings/server_position", {
        server_position: ServerIDArr
      })
    );
  }
};
