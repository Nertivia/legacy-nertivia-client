import { bus } from "../../main";
import { router } from "./../../router";
import Vue from "vue";

const state = {
	servers: {},
  channelsIDs: {}
};

const getters = {
  servers(state) {
    return state.servers;
  },
  channelsIDs(state) {
    return state.channelsIDs;
  }
};

const actions = {
  setChannelsIDs(context, {serverID, channelsIDs}) {
    context.commit('SET_CHANNELS_IDS', {serverID, channelsIDs});
  },
  setServers(context, servers) {
    context.commit('SET_SERVERS', servers);
  },
  setServer(context, server) {
    context.commit('SET_SERVER', server);
  },
  removeServer(context, serverID) {
    context.commit('REMOVE_SERVER', serverID);
  },
};

const mutations = {
  SET_CHANNELS_IDS(state, {serverID, channelsIDs}) {
    Vue.set(state.channelsIDs, serverID, channelsIDs);
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
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
