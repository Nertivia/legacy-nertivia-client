import { instance, wrapper } from "./Api";

export default {
  fetchRecentCreatedUsers() {
    return wrapper(instance().get(`admin/users/recent`));
  },

  fetchSearchUsers(search) {
    return wrapper(instance().get(`admin/users/search/${search}`));
  },
  fetchRecentCreatedServers() {
    return wrapper(instance().get(`admin/servers/recent`));
  },
  fetchSearchServers(search) {
    return wrapper(instance().get(`admin/servers/search/${search}`));
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
  },
  suspendUser(uniqueID, password, reason) {
    return wrapper(
      instance().delete(`admin/users/${uniqueID}`, {
        data: { password, reason }
      })
    );
  }
};
