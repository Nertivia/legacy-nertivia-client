import { instance, wrapper } from "./Api";

export default {
  createBot() {
    return wrapper(instance().post(`/bots`));
  },
  getBots() {
    return wrapper(instance().get(`/bots`));
  },
  updateBot(data, bot_id) {
    return wrapper(instance().post(`/bots/${bot_id}`, data));
  },
  addBot(bot_id, server_id, permissions) {
    return wrapper(instance().put(`/bots/${bot_id}/servers/${server_id}`, {permissions}));
  },
  getBot(botId, getToken = false, getMyServers) {
    const params = {};
    if (getToken) {
      params.getToken = true;
    }
    if (getMyServers) {
      params.myservers = true;
    }
    return wrapper(instance().get(`/bots/${botId}${getToken ? '?token=true' : ''}`, { params }));
  },
};
