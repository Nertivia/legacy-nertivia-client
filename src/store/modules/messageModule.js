import {bus} from '../../main'
import {router} from '../../router'
import Vue from 'vue';

const state = {
  messages: {}
}

const getters = {
  messages(state) {
    return state.messages;
  }

}

const actions = {
  messages(context, data) {
    context.commit('messages', data)
  },
  addMessage(context, data) {
    if (data.sender) {
      data.message.creator = context.getters.user
      data.message.status = 0;
    }
    context.commit('addMessage', data);
  },
  replaceMessage(context, data) {
    context.commit('replaceMessage', data)
  }
}

const mutations = {
  messages(state, data) {
    Vue.set(state.messages, data.channelID, data.messages.reverse())
    setTimeout(() => {
      bus.$emit('scrollDown', 0);
    }, 300);
  },
  addMessage(state, data) {
    bus.$emit('scrollDown', 300);
    Vue.set(
      state.messages[data.channelID],
      state.messages[data.channelID].length,
      data.message
    );
  },

  replaceMessage (state, data) {
    const {tempID, message} = data;

    state.messages[message.channelID].find((o, i) => {
      if(o.tempID === tempID) {
        Vue.set(
          state.messages[message.channelID],
          i,
          message
        )
        return true;
      }
    })

  }
}

export default {
  namespace: true,
  state,
  actions,
  mutations,
  getters
}