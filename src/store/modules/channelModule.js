import {bus} from '../../main'
import {router} from './../../router'

const state = {
  selectedChannelID: null,
  channelName: null,
  channels: {}
}

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
}

const actions = {
  channel(context, channel) {
    context.commit('channel', channel)
  },
  selectedChannelID(context, channelID) {
    context.commit('selectedChannelID', channelID)
  },
  setName(context, name) {
    context.commit('setName', name)
  }
}

const mutations = {
  channel(state, channel) {
    state.channels[channel.channelID] = channel;
  },
  selectedChannelID(state, channelID) {
    state.selectedChannelID = channelID;
  },
  setName(state, name) {
    state.channelName = name;
  }
}

export default {
  namespace: true,
  state,
  actions,
  mutations,
  getters
}