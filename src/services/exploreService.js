import {instance, wrapper} from './Api';

export default {
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

}