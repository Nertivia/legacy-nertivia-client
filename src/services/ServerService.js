import {instance, wrapper} from './Api';

export default {
  post ( data )  {
    return wrapper(instance().post('/servers', data));
  },
  updateServer (serverID, data) {
    return wrapper(instance().patch(`/servers/${serverID}`, data));
  },
  getChannels(serverID) {
    return wrapper(instance().get(`/servers/${serverID}/channels`));
  },
  createChannel(serverID, name) {
    return wrapper(instance().put(`/servers/${serverID}/channels`, {name}));
  },
  updateChannel (serverID, channelID, data) {
    return wrapper(instance().patch(`/servers/${serverID}/channels/${channelID}`, data));
  },
  deleteChannel (serverID, channelID) {
    return wrapper(instance().delete(`/servers/${serverID}/channels/${channelID}`));
  },
  postInvite (serverID) {
    return wrapper (instance().post(`/servers/${serverID}/invite`))
  },
  getInvites (serverID) {
    return wrapper (instance().get(`/servers/${serverID}/invites`))
  },
  getInviteDetail (inviteCode) {
    return wrapper (instance().get(`/servers/invite/${inviteCode}`))
  },
  joinServer (inviteCode) {
    return wrapper (instance().post(`/servers/invite/${inviteCode}`))
  },
  leaveServer (serverID) {
    return wrapper (instance().delete(`/servers/${serverID}`))
  },
  
}