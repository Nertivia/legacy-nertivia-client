import { instance, wrapper } from "./Api";

export default {
  createBot() {
    return wrapper(instance().post(`/bots`));
  },
  getBots() {
    return wrapper(instance().get(`/bots`));
  },
  getCommands(bot_ids) {
    return wrapper(instance().get(`/bots/commands`, { params: bot_ids }));
  },
  updateBot(data, bot_id) {
    return wrapper(instance().post(`/bots/${bot_id}`, data));
  },
  deleteBot(bot_id) {
    return wrapper(instance().delete(`/bots/${bot_id}`));
  },
  addBot(bot_id, server_id, permissions) {
    return wrapper(
      instance().put(`/bots/${bot_id}/servers/${server_id}`, { permissions })
    );
  },
  resetToken(bot_id) {
    return wrapper(instance().post(`/bots/${bot_id}/reset-token`));
  },
  getBot(botId, getToken = false, getMyServers) {
    const params = {};
    if (getToken) {
      params.getToken = true;
    }
    if (getMyServers) {
      params.myservers = true;
    }
    return wrapper(
      instance().get(`/bots/${botId}${getToken ? "?token=true" : ""}`, {
        params
      })
    );
  }
};
