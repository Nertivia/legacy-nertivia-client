import { instance, wrapper } from "./Api";

export default {
  fetchRecentCreatedUsers() {
    return wrapper(instance().get(`admin/users/recent`));
  },
  fetchOnlineUsers() {
    return wrapper(instance().get(`admin/users/online`));
  },
  fetchWaitingThemes() {
    return wrapper(instance().get(`admin/themes/waiting`));
  },
  fetchTheme(id) {
    return wrapper(instance().get(`admin/themes/${id}`));
  },
  approveTheme(id) {
    return wrapper(instance().patch(`admin/themes/${id}/approve`));
  }
};
