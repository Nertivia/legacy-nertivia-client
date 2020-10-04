import Vue from "vue";
import NotificationSounds from "@/utils/notificationSound";

const state = {
  notifications: [],
  mutedChannels: [],
  mutedServers: []
};

const getters = {
  notifications(state) {
    return state.notifications;
  },
  mutedChannels(state) {
    return state.mutedChannels;
  }
};

const actions = {
  addAllNotifications(context, notifications) {
    context.commit("addAllNotifications", notifications);
  },
  setMutedChannels(context, mutedChannelArr) {
    context.commit("setMutedChannels", mutedChannelArr);
  },
  setMutedServers(context, mutedServersArr) {
    context.commit("setMutedServers", mutedServersArr);
  },
  setMutedServerType(context, { server_id, muted }) {
    context.commit("setMutedServerType", { server_id, muted });
  },
  addMutedChannel(context, channelID) {
    context.commit("addMutedChannel", channelID);
  },
  removeMutedChannel(context, channelID) {
    context.commit("removeMutedChannel", channelID);
  },
  messageCreatedNotification(context, notification) {
    const {
      channelID,
      lastMessageID,
      sender,
      mentioned,
      muteSound
    } = notification;
    const currentTab = context.rootGetters.currentTab;

    // dont display a notification if the channel is selected.
    const isMessagingTab = currentTab === 1 || currentTab === 2;
    const isChannelSelected =
      context.rootState.channelModule.currentChannelID === channelID;

    if (!isChannelSelected || !isMessagingTab || !document.hasFocus()) {
      if (!muteSound){
        NotificationSounds.notification(mentioned);
      }
    }

    let find = context.state.notifications.find(item => {
      return item.channelID === channelID;
    });
    if (find) {
      return context.commit("messageCreatedNotification", {
        exists: true,
        notification: { channelID, lastMessageID, sender, mentioned }
      });
    }
    context.commit("messageCreatedNotification", {
      exists: false,
      notification: { channelID, lastMessageID, sender, count: 1, mentioned }
    });
  },
  dismissNotification(context, channelID) {
    const notifications = context.state.notifications;
    for (let index = 0; index < notifications.length; index++) {
      if (notifications[index].channelID === channelID) {
        context.commit("dismissNotification", index);
        break;
      }
    }
  }
};

const mutations = {
  dismissNotification(state, index) {
    Vue.delete(state.notifications, index);
  },
  addAllNotifications(state, notifications) {
    Vue.set(state, "notifications", notifications);
  },
  setMutedChannels(state, mutedChannelArr) {
    Vue.set(state, "mutedChannels", mutedChannelArr);
  },
  setMutedServers(state, mutedServerArr) {
    Vue.set(state, "mutedServers", mutedServerArr);
  },
  addMutedChannel(state, channelID) {
    state.mutedChannels.push(channelID);
  },
  setMutedServerType(state, { server_id, muted }) {
    const i = state.mutedServers.findIndex(ms => ms.server_id === server_id);
    if (i === -1) {
      state.mutedServers.push({ server_id, muted });
      return;
    }
    Vue.set(state.mutedServers, i, { server_id, muted });
  },
  removeMutedChannel(state, channelID) {
    state.mutedChannels = state.mutedChannels.filter(mc => mc !== channelID);
  },
  messageCreatedNotification(state, data) {
    const { exists, notification } = data;
    if (exists) {
      for (let i = 0; i < state.notifications.length; i++) {
        if (state.notifications[i].channelID === notification.channelID) {
          const count = state.notifications[i].count;
          Vue.set(state.notifications[i], "count", count + 1);
          if (!state.notifications[i].mentioned) {
            Vue.set(
              state.notifications[i],
              "mentioned",
              notification.mentioned
            );
          }
          Vue.set(
            state.notifications[i],
            "lastMessageID",
            data.notification.lastMessageID
          );
          Vue.set(state.notifications[i], "sender", data.notification.sender);
          break;
        }
      }
      return;
    }
    state.notifications.push(notification);
  }
};

export default {
  namespace: true,
  state,
  actions,
  mutations,
  getters
};
