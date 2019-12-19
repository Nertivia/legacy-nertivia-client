import { instance, wrapper } from "./Api";

export default {
  post(data) {
    return wrapper(instance().post("/servers", data));
  },
  getChannels(serverID) {
    return wrapper(instance().get(`/servers/${serverID}/channels`));
  },

  postInvite(serverID) {
    return wrapper(instance().post(`/servers/${serverID}/invite`));
  },
  getInvites(serverID) {
    return wrapper(instance().get(`/servers/${serverID}/invites`));
  },
  getInviteDetail(inviteCode) {
    return wrapper(instance().get(`/servers/invite/${inviteCode}`));
  },
  joinServer(inviteCode, optionalData) {
    return wrapper(
      instance().post(`/servers/invite/${inviteCode}`, optionalData)
    );
  },
  joinServerById(server_id, optionalData) {
    return wrapper(
      instance().post(`/servers/invite/servers/${server_id}`, optionalData)
    );
  },
  leaveServer(serverID) {
    return wrapper(instance().delete(`/servers/${serverID}`));
  },

  // Admin commands
  updateServer(serverID, data) {
    return wrapper(instance().patch(`/servers/${serverID}`, data));
  },
  createChannel(serverID, name) {
    return wrapper(instance().put(`/servers/${serverID}/channels`, { name }));
  },
  channelPosition(serverID, channelIDArr) {
    return wrapper(
      instance().put(`/servers/${serverID}/channels/position`, {
        channel_position: channelIDArr
      })
    );
  },
  updateChannel(serverID, channelID, data) {
    return wrapper(
      instance().patch(`/servers/${serverID}/channels/${channelID}`, data)
    );
  },
  deleteChannel(serverID, channelID) {
    return wrapper(
      instance().delete(`/servers/${serverID}/channels/${channelID}`)
    );
  },
  kickMember(serverID, uniqueID) {
    return wrapper(
      instance().delete(`/servers/${serverID}/members/${uniqueID}`)
    );
  },
  banMember(serverID, uniqueID) {
    return wrapper(instance().put(`/servers/${serverID}/bans/${uniqueID}`));
  },
  unBanMember(serverID, uniqueID) {
    return wrapper(instance().delete(`/servers/${serverID}/bans/${uniqueID}`));
  },
  memberBans(serverID) {
    return wrapper(instance().get(`/servers/${serverID}/bans`));
  },

  // roles
  createRole(serverID, data) {
    return wrapper(instance().post(`/servers/${serverID}/roles`, data));
  },
  // roles
  deleteRole(serverID, roleID) {
    return wrapper(instance().delete(`/servers/${serverID}/roles/${roleID}`));
  },
  // roles
  updateRole(serverID, roleID, data) {
    return wrapper(
      instance().patch(`/servers/${serverID}/roles/${roleID}`, data)
    );
  },
  applyRoleToMember(serverID, roleID, memberID) {
    return wrapper(
      instance().patch(
        `/servers/${serverID}/members/${memberID}/roles/${roleID}`
      )
    );
  },
  removeRoleFromMember(serverID, roleID, memberID) {
    return wrapper(
      instance().delete(
        `/servers/${serverID}/members/${memberID}/roles/${roleID}`
      )
    );
  }
};
