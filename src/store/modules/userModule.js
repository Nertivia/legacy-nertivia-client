import axios from "axios";
import Vue from "vue";
import NotificationSounds from "@/utils/notificationSound";
import AuthenticationService from "@/services/AuthenticationService";

const state = {
  token: localStorage.getItem("hauthid") || null,
  channelID: "",
  user: null
};

const getters = {
  tokenExists(state) {
    return state.token !== null;
  },
  user(state) {
    return state.user;
  },
  loggedIn(state) {
    return state.user !== null;
  }
};

const actions = {
  token(context, token) {
    context.commit("token", token);
  },
  user(context, user) {
    context.commit("user", user);
  },
  async logout(context) {
    axios.defaults.headers.common["authorization"] = "";
    await AuthenticationService.logout();
    localStorage.clear();
    context.commit("logout");
  },
  changeStatus(context, status) {
    context.commit("changeStatus", status);
  },
  changeCustomStatus(context, customStatus) {
    context.commit("changeCustomStatus", customStatus);
  },
  surveyCompleted(context) {
    context.commit("surveyCompleted");
  },
  updateUser(context, user) {
    const update = Object.assign({}, context.state.user, user);
    context.commit("UPDATE_USER", update);
  }
};

const mutations = {
  UPDATE_USER(state, user) {
    Vue.set(state, "user", user);
  },
  surveyCompleted(state) {
    Vue.set(state.user, "survey_completed", true);
  },
  changeAvatar(state, avatar) {
    //changes my avatar
    Vue.set(state.user, "avatar", avatar);
  },
  changeStatus(state, status) {
    //changes my status
    Vue.set(state.user, "status", status);
  },
  changeCustomStatus(state, customStatus) {
    Vue.set(state.user, "custom_status", customStatus);
  },
  token(state, token) {
    axios.defaults.headers.common["authorization"] = token;
    localStorage.setItem("hauthid", token);
    state.token = token;
  },
  logout(state) {
    (state.user = null), (state.token = null);
  },
  user(state, user) {
    Vue.set(state, "user", user);
  },
  addFriend(state, friend) {
    const friends = state.user.friends;
    friends[friend.id] = friend;

    state.user.friends = Object.assign({}, friends);

    if (friend.status == 1) {
      NotificationSounds.newFriend();
    }
  },
  removeFriend(state, id) {
    const friends = state.user.friends;
    delete friends[id];

    state.user.friends = Object.assign({}, friends);
  },
  acceptFriend(state, id) {
    const friends = state.user.friends;
    friends[id].status = 2;

    state.user.friends = Object.assign({}, friends);
  }
};

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
};
