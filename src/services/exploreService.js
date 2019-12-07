import {instance, wrapper} from './Api';

export default {
  // servers
  getServersList (params) {
    return wrapper(instance().get(`explore/servers${params || ''}`))
  },
  getServer (server_id) {
    return wrapper(instance().get(`explore/servers/${server_id}`))
  },
  deleteServer (server_id) {
    return wrapper(instance().delete(`explore/servers/${server_id}`))
  },
  updateServer (server_id, data) {
    return wrapper(instance().patch(`explore/servers/${server_id}`, data))
  },
  addServersList (data) {
    return wrapper(instance().post(`explore/servers`, data))
  },

  // themes
  getThemes() {
    return wrapper(instance().get(`explore/themes`));
  },
  getTheme(id) {
    return wrapper(instance().get(`explore/themes/${id}`));
  },
  addTheme(id, data) {
    return wrapper(instance().post(`explore/themes/${id}`, data))
  },
  updateTheme(id, data) {
    return wrapper(instance().patch(`explore/themes/${id}`, data))
  },
  applyTheme(id) {
    return wrapper(instance().get(`explore/themes/${id}/apply`));
  }


}