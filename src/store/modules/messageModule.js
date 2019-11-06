import { bus } from "../../main";
import { router } from "../../router";
import Vue from "vue";
import channelService from "@/services/channelService";
import messagesService from "@/services/messagesService";

const state = {
  messages: {},
  scrollPosition: {},
  bottomUnloaded: {}
};

const getters = {
  messages(state) {
    return state.messages;
  },
  scrollPosition(state) {
    return state.scrollPosition;
  },
  bottomUnloaded(state) {
    return state.bottomUnloaded;
  }
};

const actions = {
  // server channel
  async openChannel(context, channel) {
    context.commit("selectedChannelID", channel.channelID);
    context.commit("setChannelName", channel.name);
    const messages = context.state.messages[channel.channelID];
    if (messages) {
      context.commit("selectedChannelID", channel.channelID);
      context.commit("setServerChannelID", channel.channelID);
      return;
    }
    getMessages(context, channel.channelID, true);
  },
  //dm channel
  async openChat(context, { uniqueID, channelID, channelName }) {
    if (channelName) context.commit("setChannelName", channelName);
    const channels = context.rootState.channelModule.channels;
    channelID = Object.keys(channels).find(_channelID => {
      return (
        channels[_channelID].recipients &&
        channels[_channelID].recipients.length &&
        channels[_channelID].recipients[0].uniqueID === uniqueID
      );
    });
    const messages = context.state.messages[channelID];
    const channel = channels[channelID];

    context.commit("selectedUserUniqueID", uniqueID);
    if (channelID) {
      context.commit("setDMChannelID", channelID);
      context.commit("selectedChannelID", channelID);
    } else {
      context.commit("selectedChannelID", "Loading");
    }

    if (messages) return;
    if (channel && !messages) return getMessages(context, channelID);

    const { ok, error, result } = await channelService.post(uniqueID);
    if (ok) {
      context.commit("setDMChannelID", result.data.channel.channelID);
      context.commit("selectedChannelID", result.data.channel.channelID);

      context.commit("channel", result.data.channel);
      getMessages(context, result.data.channel.channelID, false);
    } else {
      // TODO handle this
      console.log(error);
    }
  },
  messages(context, data) {
    context.commit("messages", data);
  },
  addMessage(context, data) {
    //check if bottom messages unloaded.
    const channelID = data.message.channelID;
    const unloadedList = context.state.bottomUnloaded[channelID];
    if (unloadedList) return;

    // if the message is sent by this client, add additional information.
    if (data.sender) {
      data.message.creator = context.getters.user;
      data.message.status = 0;
    }

    context.commit("addMessage", data);
  },
  addMessages(context, messagesArr) {
    const channelID = messagesArr[0].channelID;
    const messages = context.state.messages[channelID];

    const join = [...messagesArr.reverse(), ...messages];

    context.commit("messages", { messages: join, channelID });
  },
  addMessagesBefore(context, messagesArr) {
    const channelID = messagesArr[0].channelID;
    const messages = context.state.messages[channelID];

    const join = [...messages, ...messagesArr];

    context.commit("messages", { messages: join, channelID });
  },
  replaceMessage(context, data) {
    context.commit("replaceMessage", data);
  },
  deleteMessage(context, { channelID, messageID }) {
    const messages = context.state.messages[channelID];
    messages.find((obj, index) => {
      if (obj.messageID === messageID) {
        context.commit("deleteMessage", { channelID, index });
        return true;
      }
    });
  },
  deleteAllMessages(context, channelIDArr) {
    const messages = Object.assign({}, context.state.messages);
    for (let index = 0; index < channelIDArr.length; index++) {
      const channelID = channelIDArr[index];
      delete messages[channelID];
    }
    context.commit("setAllMessages", messages);
  },
  updateMessage(context, { channelID, messageID, message }) {
    const messages = context.state.messages[channelID];
    messages.find((obj, index) => {
      if (obj.messageID === messageID) {
        const newObj = Object.assign({}, obj, message);
        context.commit("updateMessage", { message: newObj, index });
        return true;
      }
    });
  },
  changeScrollPosition(context, { channelID, pos }) {
    context.commit("changeScrollPosition", { channelID, pos });
  },
  unloadTopMessages(context, { channelID }) {
    const messages = [...[], ...context.state.messages[channelID]];
    const unloaded = messages.splice(50);
    context.commit("messages", { channelID, messages: unloaded });
  },
  unloadBottomMessages(context, { channelID }) {
    const messages = context.state.messages[channelID];
    const unloaded = messages.slice(0, -50);

    context.commit("messages", { channelID, messages: unloaded });
  },
  setBottomUnloadStatus(context, { channelID, status }) {
    context.commit("setBottomUnloadStatus", { channelID, status });
  }
};

async function getMessages(context, channelID, isServerChannel) {
  const { ok, error, result } = await messagesService.get(channelID);
  if (ok) {
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
  setAllMessages(state, messages) {
    state.messages = messages;
  },
  setBottomUnloadStatus(state, { channelID, status }) {
    Vue.set(state.bottomUnloaded, channelID, status);
  },
  changeScrollPosition(state, { channelID, pos }) {
    Vue.set(state.scrollPosition, channelID, pos);
  },
  deleteMessage(state, { channelID, index }) {
    Vue.delete(state.messages[channelID], index);
  },
  updateMessage(state, { message, index }) {
    Vue.set(state.messages[message.channelID], index, message);
  },
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
        Vue.set(
          state.messages[message.channelID],
          i,
          Object.assign({}, message, { tempID })
        );
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
