import {instance, wrapper} from './Api';

export default {
  post ( data )  {
    return wrapper(instance().post('/server', data));
  },
  updateServer (serverID, data) {
    return wrapper(instance().patch(`/server/${serverID}`, data));
  },
  getChannels(serverID) {
    return wrapper(instance().get(`/server/channels/${serverID}`));
  },
  createChannel(serverID, name) {
    return wrapper(instance().put(`/server/${serverID}/channel`, {name}));
  },
  updateChannel (serverID, channelID, data) {
    return wrapper(instance().patch(`/server/${serverID}/channels/${channelID}`, data));
  },
  deleteChannel (serverID, channelID) {
    return wrapper(instance().delete(`/server/${serverID}/channels/${channelID}`));
  },
  postInvite (serverID) {
    return wrapper (instance().post(`/server/${serverID}/invite`))
  },
  getInvites (serverID) {
    return wrapper (instance().get(`/server/${serverID}/invites`))
  },
  getInviteDetail (inviteCode) {
    return wrapper (instance().get(`/server/invite/${inviteCode}`))
  },
  joinServer (inviteCode) {
    return wrapper (instance().post(`/server/invite/${inviteCode}`))
  },
  leaveServer (serverID) {
    return wrapper (instance().delete(`/server/${serverID}`))
  },
  
}