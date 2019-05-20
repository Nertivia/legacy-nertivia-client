import { bus } from "../../main";
import { router } from "../../router";
import Vue from "vue";
import channelService from "@/services/channelService";
import messagesService from "@/services/messagesService";

const state = {
  messages: {}
};

const getters = {
  messages(state) {
    return state.messages;
  }
};

const actions = {
  async openChannel(context, channel) {
    context.commit("setChannelName", channel.name);
    const messages = context.state.messages[channel.channelID];
    if (messages) return context.commit("selectedChannelID", channel.channelID);
    context.commit("selectedChannelID", "loading")
    getMessages(context, channel.channelID);

  },
  async openChat(context, { uniqueID, channelID, channelName }) {

    if (channelName) context.commit("setChannelName", channelName);

    const channels = context.rootState.channelModule.channels;
    channelID = Object.keys(channels).find(_channelID => {
      return channels[_channelID].recipients[0].uniqueID === uniqueID
    })
    const messages = context.state.messages[channelID];
    const channel = channels[channelID];
    
    if (channelID) {
      context.commit("selectedChannelID", channelID); 
    } else {
      context.commit("selectedChannelID", "Loading");
    }

    if (messages) return;
    if (channel && !messages) return getMessages(context, channelID);


    const { ok, error, result } = await channelService.post(uniqueID);
    if (ok) {
      context.commit("channel", result.data.channel);
      getMessages(context, result.data.channel.channelID);
    } else {
      // TODO handle this
      console.log(error);
    }


  },

  messages(context, data) {
    context.commit("messages", data);
  },
  addMessage(context, data) {
    // if the message is sent by this client, add additional information.
    if (data.sender) {
      data.message.creator = context.getters.user;
      data.message.status = 0;
    }

    // send notification if message is not ours
    context.commit("addMessage", data);
  },
  replaceMessage(context, data) {
    context.commit("replaceMessage", data);
  }
};

async function getMessages(context, channelID) {
  const { ok, error, result } = await messagesService.get(channelID);
  if (ok) {
    context.commit("selectedChannelID", channelID);
    context.commit("messages", {
      channelID: result.data.channelID,
      messages: result.data.messages.reverse()
    });
  } else {
    // TODO handle this
    console.log(error.response);
  }
}


const mutations = {
  messages(state, data) {
    Vue.set(state.messages, data.channelID, data.messages);
  },
  addMessage(state, data) {
    bus.$emit("newMessage", data);
    Vue.set(
      state.messages[data.channelID],
      state.messages[data.channelID].length,
      data.message
    );
  },

  replaceMessage(state, data) {
    const { tempID, message } = data;

    state.messages[message.channelID].find((o, i) => {
      if (o.tempID === tempID) {
        Vue.set(state.messages[message.channelID], i, message);
        return true;
      }
    });
  }
};

export default {
  namespace: true,
  state,
  actions,
  mutations,
  getters
};
