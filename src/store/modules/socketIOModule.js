import config from "@/config";
import { bus } from "../../main";
//import { router } from "./../../router";
import DesktopNotification from "@/utils/ElectronJS/DesktopNotification";
import isElectron from "@/utils/ElectronJS/isElectron";
import { isMobile } from "@/utils/Mobile";

const actions = {
  socket_authErr(context, message) {
    context.dispatch("setConnectionErrorMessage", message, {
      root: true
    });
  },
  socket_connect(context) {
    context.dispatch("setConnectionStatus", 1, { root: true });
    this._vm.$socket.client.emit("authentication", {
      token: localStorage.getItem("hauthid")
    });
  },
  socket_disconnect(context) {
    context.dispatch("setConnectionStatus", 0, { root: true });
    context.commit("user", null);
  },
  socket_error(context, error) {
    console.log(error);
    context.dispatch(
      "setConnectionErrorMessage",
      "Something went wrong. Reload the page.",
      { root: true }
    );
  },
  socket_success(context, data) {
    context.dispatch("setConnectionStatus", 2, { root: true });
    const {
      user,
      serverMembers,
      serverRoles,
      dms,
      mutedChannels,
      notifications,
      currentFriendStatus,
      settings
    } = data;

    const friendsArr = user.friends;

    const presence = {};
    const friendObj = {};
    const memberObj = {};
    if (friendsArr) {
      for (let friend of friendsArr) {
        const member = friend.recipient;
        delete friend.recipient;
        friend.uniqueID = member.uniqueID;
        friendObj[member.uniqueID] = friend;
        memberObj[member.uniqueID] = member;
      }
    }
    if (currentFriendStatus) {
      for (const _presence of currentFriendStatus) {
        presence[_presence[0]] = _presence[1];
      }
    }

    context.dispatch("members/addPresences", presence);

    context.dispatch("members/addMembers", memberObj);
    let servers = user.servers || [];

    if (settings.server_position) {
      // sort server by users order
      let tempServers = [...servers];
      let sortedServers = [];

      for (let index = 0; index < settings.server_position.length; index++) {
        const server_id = settings.server_position[index];
        const findIndex = tempServers.findIndex(s => s.server_id == server_id);
        if (tempServers[findIndex]) {
          sortedServers = [...sortedServers, ...[tempServers[findIndex]]];
          tempServers.splice(findIndex, 1);
        }
      }

      servers = [...sortedServers.reverse(), ...tempServers];
      sortedServers = null;
      tempServers = null;
      delete settings.server_position;
    }

    // sort server channels by user order.
    servers.map(s => {
      if (!s.channel_position) return s;
      let tempServerChannels = [...s.channels];
      let sortedServerChannels = [];
      for (let index = 0; index < s.channel_position.length; index++) {
        const channelID = s.channel_position[index];
        const findIndex = tempServerChannels.findIndex(
          c => c.channelID == channelID
        );
        if (tempServerChannels[findIndex]) {
          sortedServerChannels = [
            ...sortedServerChannels,
            ...[tempServerChannels[findIndex]]
          ];
          tempServerChannels.splice(findIndex, 1);
        }
      }
      s.channels = [...sortedServerChannels, ...tempServerChannels];
      tempServerChannels = null;
      sortedServerChannels = null;
      delete s.channel_position;
      return s;
    });

    //convert array to object for servers
    servers = servers.reduce((obj, item) => {
      item.channels.forEach(element => {
        element.server = undefined;
        element._id = undefined;
        element.__v = undefined;
        element.server_id = item.server_id;

        context.dispatch("channel", element);
        context.dispatch("servers/AddChannelsIDs", {
          serverID: item.server_id,
          channelsIDs: [element.channelID]
        });
      });
      item.channels = undefined;
      obj[item.server_id] = item;
      return obj;
    }, {});

    context.dispatch("servers/setServers", servers);

    data.user.servers = undefined;
    data.user.friends = friendObj;

    context.commit("user", data.user);

    //server members
    let serverMembersArr = [];
    let membersObj = {};
    for (let serverMember of serverMembers) {
      const member = serverMember.member;
      delete serverMember.member;
      serverMember.uniqueID = member.uniqueID;
      serverMembersArr.push(serverMember);
      membersObj[member.uniqueID] = member;
    }
    const serverRolesSorted = {};
    for (let index = 0; index < serverRoles.length; index++) {
      const role = serverRoles[index];
      if (!serverRolesSorted[role.server_id]) {
        serverRolesSorted[role.server_id] = [role];
      } else {
        serverRolesSorted[role.server_id].push(role);
      }
    }
    context.dispatch("servers/setAllRoles", serverRolesSorted);
    context.dispatch("members/addMembers", membersObj);
    context.dispatch("servers/addServerMembers", serverMembersArr);

    // convert dms array to object
    const channelsObject = {};
    if (dms && dms.length >= 1) {
      for (let channel of dms) {
        channelsObject[channel.channelID] = channel;
      }
    }
    context.commit("addAllChannels", channelsObject);
    context.dispatch("setMutedChannels", mutedChannels);
    context.dispatch("addAllNotifications", notifications);
    context.dispatch("settingsModule/setSettings", settings);
  },
  socket_relationshipAdd(context, friend) {
    const member = friend.recipient;
    delete friend.recipient;
    friend.uniqueID = member.uniqueID;
    context.dispatch("members/updatePresence", {
      uniqueID: member.uniqueID,
      status: member.status
    });
    delete member.status;
    context.dispatch("members/addMember", member);
    context.commit("addFriend", friend);
  },
  socket_relationshipAccept(context, uniqueID) {
    context.commit("acceptFriend", uniqueID);
  },
  socket_relationshipRemove(context, uniqueID) {
    context.commit("removeFriend", uniqueID);
  },
  socket_receiveMessage(context, data) {
    if (data.message.type === 1) {
      if (context.getters.user.uniqueID === data.message.creator.uniqueID) {
        return;
      }
    }
    if (context.getters.channels[data.message.channelID]) {
      context.dispatch("updateChannelLastMessage", data.message.channelID);
    }
    if (context.getters.messages[data.message.channelID]) {
      context.dispatch("addMessage", {
        message: data.message,
        channelID: data.message.channelID,
        tempID: data.tempID
      });
    }

    // muted channel
    if (context.rootGetters.mutedChannels.includes(data.message.channelID))
      return;

    const currentTab = context.rootGetters.currentTab;
    const selectedChannelID = context.rootState.channelModule.selectedChannelID;

    const isSelectedChannel = selectedChannelID == data.message.channelID;
    const isCurrentTabDMOrSrvrs = currentTab === 1 || currentTab === 2;

    if (!isSelectedChannel || !document.hasFocus() || !isCurrentTabDMOrSrvrs) {
      // send notification if other users message the recipient
      if (data.message.creator.uniqueID === context.getters.user.uniqueID)
        return;
      bus.$emit(
        "title:change",
        data.message.creator.username + " sent a message."
      );
      desktopNotification();
    }

    const notification = {
      channelID: data.message.channelID,
      lastMessageID: data.message.messageID,
      sender: data.message.creator,
      mentioned: !!data.message.mentions.find(
        m => m.uniqueID === context.rootState.user.user.uniqueID
      )
    };
    context.dispatch("messageCreatedNotification", notification);
    function desktopNotification() {
      // send desktop notification
      const channel = context.getters.channels[data.message.channelID];
      const disableDesktopNotification =
        context.rootGetters["settingsModule/settings"].notification
          .disableDesktopNotification;

      if (isMobile()) return;
      if (isElectron && disableDesktopNotification === undefined)
        return sendNotification();
      if (
        disableDesktopNotification !== undefined &&
        disableDesktopNotification === false
      )
        return sendNotification();

      function sendNotification() {
        if (channel && channel.server_id) {
          const server = context.getters["servers/servers"][channel.server_id];
          DesktopNotification.serverMessage({
            serverName: server.name,
            channelName: channel.name,
            username: data.message.creator.username,
            avatarURL: config.domain + "/avatars/" + server.avatar,
            message: data.message.message,
            serverID: channel.server_id,
            bus: bus
          });
        } else {
          DesktopNotification.directMessage({
            username: data.message.creator.username,
            avatarURL:
              config.domain + "/avatars/" + data.message.creator.avatar,
            message: data.message.message,
            open: function() {
              context.dispatch("setCurrentTab", 1, { root: true });
              context.dispatch(
                "openChat",
                {
                  uniqueID: data.message.creator.uniqueID,
                  channelName: data.message.creator.username
                },
                { root: true }
              );
            }
          });
        }
      }
    }
  },
  socket_userStatusChange(context, data) {
    if (context.rootState.user.user.uniqueID === data.uniqueID) return;
    context.dispatch("members/updatePresence", {
      uniqueID: data.uniqueID,
      status: data.status
    });
  },
  socket_multiDeviceStatus(context, data) {
    context.commit("changeStatus", data.status);
  },
  socket_multiDeviceUserAvatarChange(context, data) {
    context.commit("changeAvatar", data.avatarID);
  },
  socket_userAvatarChange(context, data) {
    context.commit("members/updateAvatar", data);
  },
  ["socket_updateMember"](context, data) {
    if (context.rootGetters.user.uniqueID === data.uniqueID) {
      context.dispatch("updateUser", data);
    }
  },
  ["socket_channel:created"](context, data) {
    const { channel } = data;
    // rename to 'channel' to setChannel
    context.dispatch("channel", channel);
  },
  ["socket_channel:remove"](context, { channelID }) {
    const selectedChannelID = context.rootState.channelModule.selectedChannelID;
    if (selectedChannelID === channelID) {
      context.dispatch("selectedUserUniqueID", undefined);
      context.dispatch("selectedChannelID", undefined);
    } 
    context.dispatch("removeChannel", { channelID });
  },
  ["socket_notification:dismiss"](context, data) {
    const { channelID } = data;
    context.dispatch("dismissNotification", channelID);
  },
  ["socket_googleDrive:linked"](context) {
    context.dispatch("setPopoutVisibility", {
      name: "GDLinkMenu",
      visibility: false
    });
    context.dispatch("settingsModule/setGDriveLinked", true);
  },
  ["socket_customEmoji:uploaded"](context, emoji) {
    context.dispatch("settingsModule/addCustomEmoji", emoji);
  },
  ["socket_customEmoji:remove"](context, emoji) {
    context.dispatch("settingsModule/removeCustomEmoji", emoji);
  },
  ["socket_customEmoji:rename"](context, emoji) {
    context.dispatch("settingsModule/renameCustomEmoji", emoji);
  },
  ["socket_survey:completed"](context) {
    context.dispatch("surveyCompleted");
  },
  ["socket_server:joined"](context, server) {
    context.dispatch("servers/setServer", server);

    let channels = server.channels;

    // sort server channels by order
    if (server.channel_position) {
      let tempServerChannels = [...channels];
      let sortedServerChannels = [];
      for (let index = 0; index < server.channel_position.length; index++) {
        const channelID = server.channel_position[index];
        const findIndex = tempServerChannels.findIndex(
          c => c.channelID == channelID
        );
        if (tempServerChannels[findIndex]) {
          sortedServerChannels = [
            ...sortedServerChannels,
            ...[tempServerChannels[findIndex]]
          ];
          tempServerChannels.splice(findIndex, 1);
        }
      }
      channels = [...sortedServerChannels, ...tempServerChannels];
      tempServerChannels = null;
      sortedServerChannels = null;
      delete server.channel_position;
    }

    for (let index = 0; index < channels.length; index++) {
      const element = channels[index];
      element.server = undefined;
      element.server_id = server.server_id;
      context.dispatch("channel", element);
      context.dispatch("servers/AddChannelsIDs", {
        serverID: server.server_id,
        channelsIDs: [element.channelID]
      });
    }

    if (!server.socketID) return;
    if (this._vm.$socket.client.id !== server.socketID) return;
    const defaultChannel = channels.find(
      c => c.channelID === server.default_channel_id
    );
    context.dispatch("setCurrentTab", 2, { root: true });
    context.dispatch("servers/setSelectedServerID", server.server_id, {
      root: true
    });
    context.dispatch("openChannel", defaultChannel, { root: true });
  },
  ["socket_server:leave"](context, { server_id }) {
    const lastSelectedChannel = JSON.parse(
      localStorage.getItem("selectedChannels") || "{}"
    );
    if (lastSelectedChannel[server_id]) {
      delete lastSelectedChannel[server_id];
      localStorage.setItem(
        "selectedChannels",
        JSON.stringify(lastSelectedChannel)
      );
    }
    // check if server channel selected
    const serverChannelIDs = context.rootState.servers.channelsIDs[server_id];

    const selectedChannelID = context.rootState.channelModule.selectedChannelID;
    const serverChannelID = context.rootState.channelModule.serverChannelID;
    const serverID = context.rootState.servers.selectedServerID;

    if (serverChannelIDs.includes(selectedChannelID)) {
      context.dispatch("selectedChannelID", null);
    }
    if (serverChannelIDs.includes(serverChannelID)) {
      context.dispatch("setServerChannelID", null);
    }
    if (serverID === server_id) {
      context.dispatch("servers/setSelectedServerID", null);
    }
    context.dispatch("servers/removePresences", server_id);
    context.dispatch("servers/removeServer", server_id);
    context.dispatch("servers/removeNotifications", server_id);
    context.dispatch("servers/removeAllRoles", server_id);
    context.dispatch("servers/removeAllServerChannels", server_id);
    context.dispatch("deleteAllMessages", serverChannelIDs);
  },
  ["socket_server:memberAdd"](context, { serverMember, presence }) {
    // member_add
    let sm = Object.assign({}, serverMember);
    const member = sm.member;
    delete sm.member;
    sm.uniqueID = member.uniqueID;

    context.dispatch("members/updatePresence", {
      uniqueID: member.uniqueID,
      status: presence
    });
    context.dispatch("members/addMember", member);
    context.dispatch("servers/addServerMember", sm);
  },
  ["socket_server:memberRemove"](context, { uniqueID, server_id }) {
    // member_remove
    context.dispatch("servers/removeServerMember", { uniqueID, server_id });
  },
  ["socket_server:members"](context, { serverMembers, memberPresences }) {
    // members
    let serverMembersArr = [];
    let members = {};
    for (let serverMember of serverMembers) {
      const member = serverMember.member;
      delete serverMember.member;
      serverMember.uniqueID = member.uniqueID;
      serverMembersArr.push(serverMember);
      members[member.uniqueID] = member;
    }
    context.dispatch("members/addMembers", members);
    context.dispatch("servers/addServerMembers", serverMembers);
    let presences = {};
    for (const _presence of memberPresences) {
      presences[_presence[0]] = _presence[1];
    }
    context.dispatch("members/addPresences", presences);
  },
  ["socket_server:addChannel"](context, { channel }) {
    // add_channel
    context.dispatch("channel", channel);
    context.dispatch("servers/AddChannelsIDs", {
      serverID: channel.server_id,
      channelsIDs: [channel.channelID]
    });
  },
  ["socket_server:updateChannel"](context, update) {
    // update_channel
    context.dispatch("updateChannel", update);
  },
  ["socket_server:removeChannel"](context, { server_id, channelID }) {
    context.dispatch("servers/removeServerChannel", { server_id, channelID });
    context.dispatch("dismissNotification", channelID);
  },
  ["socket_server:updateServer"](context, data) {
    context.dispatch("servers/updateServer", {
      server_id: data.server_id,
      server: data
    });
  },
  ["socket_updateMessage"](context, data) {
    context.dispatch("updateMessage", {
      channelID: data.channelID,
      messageID: data.messageID,
      message: data
    });
  },
  ["socket_deleteMessage"](context, { channelID, messageID }) {
    context.dispatch("deleteMessage", { channelID, messageID });
  },
  ["socket_self:serverPosition"](context, { server_position }) {
    const servers = context.rootGetters["servers/servers"];
    let serverSorted = {};
    for (let index = 0; index < server_position.length; index++) {
      const server_id = server_position[index];
      serverSorted = {
        ...{ [server_id]: servers[server_id] },
        ...serverSorted
      };
    }
    context.dispatch("servers/setServers", serverSorted);
  },
  ["socket_server:channelPosition"](context, { serverID, channel_position }) {
    context.dispatch("servers/setChannelIDs", {
      serverID,
      channelIDs: channel_position
    });
  },
  ["socket_server:createRole"](context, role) {
    context.dispatch("servers/addRole", role);
  },
  ["socket_server:updateRole"](context, updatedDetails) {
    context.dispatch("servers/updateRole", updatedDetails);
  },
  ["socket_server:deleteRole"](context, { role_id, server_id }) {
    context.dispatch("servers/deleteRole", { role_id, server_id });
  },
  ["socket_serverMember:addRole"](context, { role_id, uniqueID, server_id }) {
    context.dispatch("servers/addMemberRole", { role_id, uniqueID, server_id });
  },
  // eslint-disable-next-line prettier/prettier
  ["socket_serverMember:removeRole"](
    context,
    { role_id, uniqueID, server_id }
  ) {
    // eslint-disable-next-line prettier/prettier
    context.dispatch("servers/removeMemberRole", {
      role_id,
      uniqueID,
      server_id
    });
  },
  ["socket_server:updateRoles"](context, { roles }) {
    // eslint-disable-next-line prettier/prettier
    context.dispatch("servers/setServerRoles", roles);
  },
  ["socket_server:roles"](context, { roles }) {
    context.dispatch("servers/setServerRoles", roles);
  },
  ["socket_channel:mute"](context, { channelID }) {
    context.dispatch("addMutedChannel", channelID);
  },
  ["socket_channel:unmute"](context, { channelID }) {
    context.dispatch("removeMutedChannel", channelID);
  }
};

export default {
  namespace: true,
  actions
};
