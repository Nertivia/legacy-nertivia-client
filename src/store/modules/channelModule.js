import { bus } from "../../main";
import { router } from "./../../router";
import Vue from "vue";

const state = {
  selectedChannelID: null,
  DMChannelID: null,
  serverChannelID: null,
  channelName: null,
  channels: {}
};

const getters = {
  selectedChannelID(state) {
    return state.selectedChannelID;
  },
  channels(state) {
    return state.channels;
  },
  channelName(state) {
    return state.channelName;
  }
};

const actions = {
  channel(context, channel) {
    context.commit("channel", channel);
  },
  removeChannel(context, {channelID}) {
    context.commit('removeChannel', channelID)
  },
  updateChannel(context, data) {
    const update = Object.assign({}, context.state.channels[data.channelID], data);
    context.commit('channel', update)
  },
  selectedChannelID(context, channelID) {
    context.commit("selectedChannelID", channelID);
  },
  setChannelName(context, name) {
    context.commit("setChannelName", name);
  },
  setDMChannelID(context, channelID) {
    context.commit("setDMChannelID", channelID);
  },
  setServerChannelID(context, channelID) {
    context.commit("setServerChannelID", channelID);
  },
  updateChannelLastMessage(context, channelID) {
    context.commit("updateChannelLastMessage", channelID);
  }
};

const mutations = {
  removeChannel(state, channelID) {
    Vue.delete(state.channels, channelID);
  },
  updateChannelLastMessage(state, channelID) {
    Vue.set(state.channels[channelID], "lastMessaged", Date.now());
  },
  addAllChannels(state, channels) {
    const test = Object.assign(state.channels, channels);
    Vue.set(state, "channels", test);
  },
  channel(state, channel) {
    Vue.set(state.channels, channel.channelID, channel);
  },
  selectedChannelID(state, channelID) {
    state.selectedChannelID = channelID;
  },
  setDMChannelID(state, channelID) {
    state.DMChannelID = channelID;
  },
  setServerChannelID(state, channelID) {
    state.serverChannelID = channelID;
  },
  setChannelName(state, name) {
    state.channelName = name;
  }
};

export default {
  namespace: true,
  state,
  actions,
  mutations,
  getters
};
