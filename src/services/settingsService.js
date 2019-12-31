import { instance, wrapper } from "./Api";

export default {
  setStatus(status) {
    return wrapper(instance().post("/settings/status", { status }));
  },
  GDriveURL() {
    return wrapper(instance().get("/settings/drive/url"));
  },
  GDriveAuth(code, token) {
    return wrapper(instance().post("/settings/drive/auth", { code, token }));
  },
  setApperance(apperance, boolean) {
    return wrapper(
      instance().put("/settings/apperance", {
        [apperance]: boolean
      })
    );
  },
  setServerPositions(ServerIDArr) {
    return wrapper(
      instance().put("/settings/server_position", {
        server_position: ServerIDArr
      })
    );
  }
};
