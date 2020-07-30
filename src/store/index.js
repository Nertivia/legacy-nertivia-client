import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/userModule";
import socketModule from "./modules/socketIOModule";
import channelModule from "./modules/channelModule";
import messageModule from "./modules/messageModule";
import notificationsModule from "./modules/notificationsModule";
import settingsModule from "./modules/settingsModule";
import uploadFilesModule from "./modules/uploadFilesModule";
import popoutsModule from "./modules/popoutsModule/popoutsModule.js";
import serversModule from "./modules/serversModule";
import membersModule from "./modules/membersModule";
Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    user,
    channelModule,
    messageModule,
    notificationsModule,
    socketModule,
    settingsModule,
    uploadFilesModule,
    popoutsModule,
    servers: serversModule,
    members: membersModule
  },
  state: {
    currentTab: 0,
    // 0 : connecting
    // 1: connected
    // 2: authenticated
    // 3: error
    connectionStatus: 0,
    connectionErrorMessage: null,
    message: "" // message panel, message area
  },
  getters: {
    currentTab(state) {
      return state.currentTab;
    },
    connectionStatus(state) {
      return state.connectionStatus;
    },
    connectionErrorMessage(state) {
      return state.connectionErrorMessage;
    },
    message(state) {
      return state.message;
    }
  },
  actions: {
    setConnectionStatus({ commit }, status) {
      commit("SET_CONNECTION_STATUS", status);
    },
    setConnectionErrorMessage({ commit }, message) {
      commit("SET_CONNECTION_ERROR_MESSAGE", message);
      commit("SET_CONNECTION_STATUS", 3);
    },
    setCurrentTab({ commit }, currentTab) {
      localStorage.setItem("currentTab", currentTab);
      commit("SET_CURRENT_TAB", currentTab);
    },
    setMessage({ commit }, message) {
      commit("SET_MESSAGE", message);
    }
  },
  mutations: {
    SET_MESSAGE(state, message) {
      state.message = message;
    },
    SET_CURRENT_TAB(state, currentTab) {
      state.currentTab = currentTab;
    },
    SET_CONNECTION_STATUS(state, status) {
      state.connectionStatus = status;
    },
    SET_CONNECTION_ERROR_MESSAGE(state, message) {
      state.connectionErrorMessage = message;
    }
  }
});
