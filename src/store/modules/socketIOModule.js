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
      mutedServers,
      notifications,
      customStatusArr,
      memberStatusArr,
      programActivityArr,
      settings,
      lastSeenServerChannels
    } = data;

    const friendsArr = user.friends;

    const presenceObj = {};
    const customStatusObj = {};
    const programActivityObj = {};
    const friendObj = {};
    const memberObj = {};
    if (friendsArr) {
      for (let index = 0; index < friendsArr.length; index++) {
        const friend = friendsArr[index];
        const member = friend.recipient;
        delete friend.recipient;
        friend.id = member.id;
        friendObj[member.id] = friend;
        memberObj[member.id] = member;
      }
    }
    if (memberStatusArr) {
      for (let index = 0; index < memberStatusArr.length; index++) {
        const presence = memberStatusArr[index];
        presenceObj[presence[0]] = presence[1];
      }
    }
    if (programActivityArr.length) {
      for (let index = 0; index < programActivityArr.length; index++) {
        const programActivity = programActivityArr[index];
        programActivityObj[programActivity.id] = {
          name: programActivity.name,
          status: programActivity.status
        };
      }
    }

    if (customStatusArr) {
      for (let index = 0; index < customStatusArr.length; index++) {
        const customStatus = customStatusArr[index];
        customStatusObj[customStatus[0]] = customStatus[1];
      }
    }

    context.dispatch("members/addProgramActivity", programActivityObj);
    context.dispatch("members/addCustomStatusArr", customStatusObj);
    context.dispatch("members/addPresences", presenceObj);

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
      serverMember.id = member.id;
      serverMembersArr.push(serverMember);
      membersObj[member.id] = member;
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
    context.dispatch("setMutedServers", mutedServers);
    context.dispatch("addAllNotifications", notifications);
    context.dispatch("addAllLastSeenServerChannels", lastSeenServerChannels);
    context.dispatch("settingsModule/setSettings", settings);
  },
  socket_relationshipAdd(context, friend) {
    const member = friend.recipient;
    delete friend.recipient;
    friend.id = member.id;
    context.dispatch("members/updatePresence", {
      id: member.id,
      status: member.status
    });
    if (friend.program_activity) {
      context.dispatch("members/addProgramActivity", {
        [member.id]: friend.program_activity
      });
    }
    context.dispatch("members/updateCustomStatus", {
      id: member.id,
      custom_status: member.custom_status
    });
    delete member.status;
    delete member.custom_status;
    context.dispatch("members/addMember", member);
    context.commit("addFriend", friend);
  },
  socket_relationshipAccept(context, id) {
    context.commit("acceptFriend", id);
  },
  socket_relationshipRemove(context, id) {
    context.commit("removeFriend", id);
  },
  socket_receiveMessage(context, data) {
    const isMessageCreatedByMe =
      context.getters.user.id === data.message.creator.id;

    if (data.message.type === 1 && isMessageCreatedByMe) {
      return;
    }

    if (context.getters.channels[data.message.channelID]) {
      context.dispatch("updateChannelLastMessage", data.message.channelID);
    }

    // if channel is opened
    if (context.getters.messages[data.message.channelID]) {
      context.dispatch("addMessage", {
        message: data.message,
        channelID: data.message.channelID,
        tempID: data.tempID
      });
    }

    const channel = context.getters.channels[data.message.channelID];
    if (isMessageCreatedByMe && channel && channel.server_id) {
      context.dispatch("dismissServerNotification", data.message.channelID);
    }

    const type = !channel ? 0 : findServerMuteType(channel.server_id);

    // muted channel
    if (context.rootGetters.mutedChannels.includes(data.message.channelID))
      return;
    if (data.message.creator.id === context.getters.user.id) return;
    if (type === 2) return;

    const currentTab = context.rootGetters.currentTab;
    const currentChannelID = context.rootState.channelModule.currentChannelID;

    const isBusy = context.rootGetters.user.status == 3;
    const iscurrentChannel = currentChannelID == data.message.channelID;
    const isCurrentTabDMOrSrvrs = currentTab === 1 || currentTab === 2;

    if (!iscurrentChannel || !document.hasFocus() || !isCurrentTabDMOrSrvrs) {
      // send notification if other users message the recipient
      desktopNotification();
    }

    if (channel && channel.server_id) {
      const notification = {
        channelID: data.message.channelID,
        sender: data.message.creator,
        mentioned: !!data.message.mentions.find(
          m => m.id === context.rootState.user.user.id
        ),
        muteSound: type === 1,
        isServer: true
      };
      const notificationExists = context.rootGetters.notifications.find(
        n => n.channelID === data.message.channelID
      );
      if (notificationExists) {
        notification.lastMessageID = notificationExists.lastMessageID;
      } else {
        notification.lastMessageID = data.message.messageID;
      }

      context.dispatch("messageCreatedNotification", notification);
    }

    if (!channel || !channel.server_id) {
      const notification = {
        channelID: data.message.channelID,
        sender: data.message.creator,
        mentioned: !!data.message.mentions.find(
          m => m.id === context.rootState.user.user.id
        ),
        muteSound: type === 1
      };
      const notificationExists = context.rootGetters.notifications.find(
        n => n.channelID === data.message.channelID
      );
      if (notificationExists) {
        notification.lastMessageID = notificationExists.lastMessageID;
      } else {
        notification.lastMessageID = data.message.messageID;
      }

      context.dispatch("messageCreatedNotification", notification);
    }

    function findServerMuteType(server_id) {
      let serverMuteType = 0; // 0 = no mute

      if (channel.server_id) {
        const mutedServers = context.rootState.notificationsModule.mutedServers;
        if (!mutedServers || !mutedServers.length) return serverMuteType;
        const findServer = mutedServers.find(ms => ms.server_id === server_id);
        if (!findServer) return serverMuteType;
        return findServer.muted;
      }
    }
    function desktopNotification() {
      // send desktop notification
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
        if (isBusy) return;
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
                  id: data.message.creator.id,
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
    if (context.rootState.user.user.id === data.user_id) return;
    context.dispatch("members/updatePresence", {
      id: data.user_id,
      status: data.status
    });
  },
  ["socket_programActivity:changed"](context, data) {
    context.dispatch("members/updateProgramActivity", data);
  },
  ["socket_member:customStatusChange"](context, data) {
    if (context.rootState.user.user.id === data.user_id) return;
    context.dispatch("members/updateCustomStatus", {
      id: data.user_id,
      custom_status: data.custom_status
    });
  },
  socket_multiDeviceStatus(context, data) {
    context.commit("changeStatus", data.status);
  },
  socket_multiDeviceCustomStatus(context, data) {
    context.commit("changeCustomStatus", data.custom_status);
  },
  socket_multiDeviceUserAvatarChange(context, data) {
    context.commit("changeAvatar", data.avatarID);
  },
  socket_userAvatarChange(context, data) {
    context.commit("members/updateAvatar", data);
  },
  ["socket_updateMember"](context, data) {
    if (context.rootGetters.user.id === data.id) {
      context.dispatch("updateUser", data);
    } else {
      context.dispatch("members/updateMember", data);
    }
  },
  ["socket_channel:created"](context, data) {
    const { channel } = data;
    // rename to 'channel' to setChannel
    context.dispatch("channel", channel);
  },
  ["socket_channel:remove"](context, { channelID }) {
    const currentChannelID = context.rootState.channelModule.currentChannelID;
    if (currentChannelID === channelID) {
      context.dispatch("selectedUserUniqueID", undefined);
      context.dispatch("currentChannelID", undefined);
    }
    context.dispatch("removeChannel", { channelID });
  },
  ["socket_notification:dismiss"](context, data) {
    const { channelID, serverNotification } = data;
    if (serverNotification) {
      context.dispatch("dismissServerNotification", channelID);
    }
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
    context.dispatch("servers/setcurrentServerID", server.server_id, {
      root: true
    });
    context.dispatch("openChannel", defaultChannel, { root: true });
  },
  ["socket_server:leave"](context, { server_id }) {
    const lastcurrentChannel = JSON.parse(
      localStorage.getItem("currentChannels") || "{}"
    );
    if (lastcurrentChannel[server_id]) {
      delete lastcurrentChannel[server_id];
      localStorage.setItem(
        "currentChannels",
        JSON.stringify(lastcurrentChannel)
      );
    }
    // check if server channel selected
    const serverChannelIDs = context.rootState.servers.channelsIDs[server_id];

    const currentChannelID = context.rootState.channelModule.currentChannelID;
    const serverChannelID = context.rootState.channelModule.serverChannelID;
    const serverID = context.rootState.servers.currentServerID;

    if (serverChannelIDs.includes(currentChannelID)) {
      context.dispatch("currentChannelID", null);
    }
    if (serverChannelIDs.includes(serverChannelID)) {
      context.dispatch("setServerChannelID", null);
    }
    if (serverID === server_id) {
      context.dispatch("servers/setcurrentServerID", null);
    }
    context.dispatch("servers/removePresences", server_id);
    context.dispatch("servers/removeServer", server_id);
    context.dispatch("servers/removeNotifications", server_id);
    context.dispatch("servers/removeAllRoles", server_id);
    context.dispatch("servers/removeAllServerChannels", server_id);
    context.dispatch("deleteAllMessages", serverChannelIDs);
  },
  ["socket_server:memberAdd"](
    context,
    { serverMember, presence, custom_status }
  ) {
    // member_add
    let sm = Object.assign({}, serverMember);
    const member = sm.member;
    delete sm.member;
    sm.id = member.id;

    context.dispatch("members/updatePresence", {
      id: member.id,
      status: presence
    });
    context.dispatch("members/updateCustomStatus", {
      id: member.id,
      custom_status: custom_status
    });
    context.dispatch("members/addMember", member);
    context.dispatch("servers/addServerMember", sm);
  },
  ["socket_server:memberRemove"](context, { id, server_id }) {
    // member_remove
    context.dispatch("servers/removeServerMember", { id, server_id });
  },
  ["socket_server:members"](
    context,
    {
      serverMembers,
      memberPresences,
      memberCustomStatusArr,
      programActivityArr
    }
  ) {
    // members
    let serverMembersArr = [];
    let members = {};
    for (let serverMember of serverMembers) {
      const member = serverMember.member;
      delete serverMember.member;
      serverMember.id = member.id;
      serverMembersArr.push(serverMember);
      members[member.id] = member;
    }
    context.dispatch("members/addMembers", members);
    context.dispatch("servers/addServerMembers", serverMembers);
    let customStatusObj = {};
    let programActivityObj = {};
    let presencesObj = {};
    for (let index = 0; index < memberPresences.length; index++) {
      const presence = memberPresences[index];
      presencesObj[presence[0]] = presence[1];
    }
    context.dispatch("members/addPresences", presencesObj);

    for (let index = 0; index < memberCustomStatusArr.length; index++) {
      const customStatus = memberCustomStatusArr[index];
      customStatusObj[customStatus[0]] = customStatus[1];
    }

    for (let index = 0; index < programActivityArr.length; index++) {
      const programActivity = programActivityArr[index];
      programActivityObj[programActivity.id] = programActivity;
    }

    context.dispatch("members/addProgramActivity", programActivityObj);

    context.dispatch("members/addCustomStatusArr", customStatusObj);
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
    context.dispatch("removeChannel", { channelID });
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
      message: {
        replace: true,
        ...data
      }
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
  ["socket_serverMember:addRole"](context, { role_id, id, server_id }) {
    context.dispatch("servers/addMemberRole", { role_id, id, server_id });
  },
  // eslint-disable-next-line prettier/prettier
  ["socket_serverMember:removeRole"](
    context,
    { role_id, id, server_id }
  ) {
    // eslint-disable-next-line prettier/prettier
    context.dispatch("servers/removeMemberRole", {
      role_id,
      id,
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
  ["socket_server:mute"](context, { server_id, muted }) {
    context.dispatch("setMutedServerType", { server_id, muted });
  },
  ["socket_channel:unmute"](context, { channelID }) {
    context.dispatch("removeMutedChannel", channelID);
  }
};

export default {
  namespace: true,
  actions
};
