import Vue from "vue";

const state = {
  selectedServerID: null,
  servers: {},
  channelsIDs: {},
  serverMembers: [],
  roles: {}
};

const getters = {
  servers(state) {
    return state.servers;
  },
  roles(state) {
    return state.roles;
  },
  channelsIDs(state) {
    return state.channelsIDs;
  },
  serverMembers(state) {
    return state.serverMembers;
  },
  selectedServerID(state) {
    return state.selectedServerID;
  },
  selectedServerRoles() {
    const serverRoles = state.roles[state.selectedServerID];
    if (!serverRoles) return [];
    return serverRoles.sort((a, b) => {
      return a.order - b.order;
    });
  }
};

const actions = {
  setChannelIDs(context, { serverID, channelIDs }) {
    context.commit("SET_CHANNEL_IDs", { serverID, channelIDs });
  },
  AddChannelsIDs(context, { serverID, channelsIDs }) {
    context.commit("ADD_CHANNELS_IDS", { serverID, channelsIDs });
  },
  setServers(context, servers) {
    context.commit("SET_SERVERS", servers);
  },
  setServer(context, server) {
    context.commit("SET_SERVER", server);
  },
  updateServer(context, { server_id, server }) {
    const update = Object.assign({}, context.state.servers[server_id], server);
    context.commit("SET_SERVER", update);
  },
  removeServer(context, serverID) {
    context.commit("REMOVE_SERVER", serverID);
  },
  addServerMembers(context, serverMembersArr) {
    context.commit("ADD_SERVER_MEMBERS", serverMembersArr);
  },
  // Roles
  addRole({ commit, state }, role) {
    let serverRoles = [];
    if (state.roles && state.roles[role.server_id]) {
      serverRoles = [...state.roles[role.server_id]];
    }
    serverRoles.push(role);

    commit("UPDATE_SERVER_ROLES", {
      roles: serverRoles,
      server_id: role.server_id
    });
  },
  setServerRoles({ commit }, rolesArr) {
    commit("UPDATE_SERVER_ROLES", {
      roles: rolesArr,
      server_id: rolesArr[0].server_id
    });
  },
  deleteRole({ commit, state }, { server_id, role_id }) {
    const serverRoles = [...state.roles[server_id]].filter(
      r => r.id !== role_id
    );

    commit("UPDATE_SERVER_ROLES", {
      roles: serverRoles,
      server_id: server_id
    });
  },
  updateRole({ commit, state }, roleUpdates) {
    const updatedRoles = state.roles[roleUpdates.server_id].map(r => {
      if (r.id === roleUpdates.id) {
        return Object.assign({}, r, roleUpdates);
      } else {
        return r;
      }
    });

    commit("UPDATE_SERVER_ROLES", {
      roles: updatedRoles,
      server_id: roleUpdates.server_id
    });
  },
  setAllRoles(context, rolesArr) {
    context.commit("SET_ALL_ROLES", rolesArr);
  },
  addMemberRole({ commit, state }, { role_id, uniqueID, server_id }) {
    const serverMemberIndex = state.serverMembers.findIndex(
      sm => sm.uniqueID === uniqueID && sm.server_id === server_id
    );
    if (!serverMemberIndex) return;

    const serverMemberNew = { ...state.serverMembers[serverMemberIndex] };
    if (!serverMemberNew.roles) {
      serverMemberNew.roles = [role_id];
    } else {
      if (serverMemberNew.roles.includes(role_id)) {
        return;
      }
      serverMemberNew.roles.push(role_id);
    }

    commit("SET_MEMBER", {
      serverMember: serverMemberNew,
      index: serverMemberIndex
    });
  },
  removeMemberRole({ commit, state }, { role_id, uniqueID, server_id }) {
    const serverMemberIndex = state.serverMembers.findIndex(
      sm => sm.uniqueID === uniqueID && sm.server_id === server_id
    );
    if (!serverMemberIndex) return;

    let serverMemberNew = { ...state.serverMembers[serverMemberIndex] };
    if (!serverMemberNew.roles || !serverMemberNew.roles.includes(role_id))
      return;

    serverMemberNew.roles = serverMemberNew.roles.filter(r => r != role_id);

    commit("SET_MEMBER", {
      serverMember: serverMemberNew,
      index: serverMemberIndex
    });
  },
  removeServerMember(context, { uniqueID, server_id }) {
    context.commit("REMOVE_SERVER_MEMBER", { uniqueID, server_id });
  },
  setSelectedServerID(context, serverID) {
    context.commit("SET_SELECTED_SERVER_ID", serverID);
  },
  addServerMember(context, serverMember) {
    context.commit("ADD_SERVER_MEMBER", serverMember);
  },
  removePresences(context, server_id) {
    const members = context.getters.serverMembers.filter(
      m => m.server_id === server_id
    );
    const friends = context.rootGetters.user.friends;
    for (let member of members) {
      if (!friends[member.uniqueID]) {
        context.dispatch(
          "members/updatePresence",
          { uniqueID: member.uniqueID, status: null },
          { root: true }
        );
      }
      context.commit("REMOVE_SERVER_MEMBER", {
        uniqueID: member.uniqueID,
        server_id
      });
    }
  },
  removeServerChannel(context, { server_id, channelID }) {
    const filter = context.state.channelsIDs[server_id].filter(
      c => c !== channelID
    );
    context.commit("SET_CHANNEL_IDs", {
      serverID: server_id,
      channelIDs: filter
    });
  },
  removeAllServerChannels(context, server_id) {
    const serverChannels = context.state.channelsIDs[server_id];
    context.dispatch("removeChannels", serverChannels, { root: true });
    context.commit("DELETE_CHANNELS", server_id);
  },
  removeNotifications(context, server_id) {
    const serverChannels = context.state.channelsIDs[server_id];
    const filteredNotifications = context.rootState.notificationsModule.notifications.filter(
      n => !serverChannels.includes(n.channelID)
    );
    context.dispatch("addAllNotifications", filteredNotifications, {
      root: true
    });
  }
};

const mutations = {
  SET_MEMBER(state, { serverMember, index }) {
    Vue.set(state.serverMembers, index, serverMember);
  },
  SET_CHANNEL_IDs(state, { serverID, channelIDs }) {
    Vue.set(state.channelsIDs, serverID, channelIDs);
  },
  DELETE_CHANNELS(state, server_id) {
    Vue.delete(state.channelsIDs, server_id);
  },
  ADD_CHANNELS_IDS(state, { serverID, channelsIDs }) {
    const previousChannels = state.channelsIDs[serverID] || [];
    Vue.set(state.channelsIDs, serverID, [
      ...new Set([...previousChannels, ...channelsIDs])
    ]);
  },
  SET_SERVERS(state, servers) {
    state.servers = servers;
  },
  SET_SERVER(state, server) {
    Vue.set(state.servers, server.server_id, server);
  },
  REMOVE_SERVER(state, serverID) {
    Vue.delete(state.servers, serverID);
  },
  ADD_SERVER_MEMBERS(state, serverMembersArr) {
    for (let members of serverMembersArr) {
      if (
        !state.serverMembers.find(
          sm =>
            sm.uniqueID === members.uniqueID &&
            sm.server_id === members.server_id
        )
      ) {
        state.serverMembers.push(members);
      }
    }
  },
  ADD_SERVER_MEMBER(state, serverMember) {
    const exists = state.serverMembers.find(
      sm =>
        sm.uniqueID === serverMember.uniqueID &&
        sm.server_id === serverMember.server_id
    );
    if (exists) return;
    state.serverMembers.push(serverMember);
  },
  SET_ALL_ROLES(state, rolesArr) {
    Vue.set(state, "roles", rolesArr);
  },
  UPDATE_SERVER_ROLES(state, { roles, server_id }) {
    Vue.set(state.roles, server_id, roles);
  },
  REMOVE_SERVER_MEMBER(state, { uniqueID, server_id }) {
    state.serverMembers = state.serverMembers.filter(
      m => m.uniqueID !== uniqueID || m.server_id !== server_id
    );
  },
  SET_SELECTED_SERVER_ID(state, serverID) {
    state.selectedServerID = serverID;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
