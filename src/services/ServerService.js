import {instance, wrapper} from './Api';

export default {
  post ( data )  {
    return wrapper(instance().post('/server', data));
  },
  getChannels(serverID) {
    return wrapper(instance().get(`/server/channels/${serverID}`));
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