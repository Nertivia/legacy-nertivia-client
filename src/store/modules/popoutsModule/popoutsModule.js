import Vue from "vue";

const state = {
  fileToUpload: null,
  uploadDialog: false,
  ImagePreviewURL: null,

  serverIDContextMenu: null,
  showServerInviteMenu: false,

  userInformationPopoutID: null,

  surveyPopout: false,
  dragDropFileUploadDialog: false,
  settings: false,
  GDLinkMenu: false,
  addServer: false,

  genericMessage: null,

  serverSettings: {
    serverID: null,
    tab: null
  },
  editMessage: null,
  serverMemberContext: {
    serverID: null,
    uniqueID: null,
    x: null,
    y: null
  },

  // TODO: convert all above into one.
  allPopout: {
    show: false,
    type: null,
    serverID: null,
    uniqueID: null,
    creatorUniqueID: null,
    id: null,
    x: null,
    y: null
  }
};

const getters = {
  popouts(state) {
    return state;
  }
};

const actions = {
  setAllPopout({ commit, state }, data) {
    commit("setAllPopout", { ...state.allPopout, ...data });
  },
  setServerSettings({ commit }, { serverID, tab }) {
    commit("setServerSettings", { serverID, tab });
  },
  setUserInformationPopout({ commit }, id) {
    commit("setUserInformationPopout", id);
  },
  setPopoutVisibility(context, data) {
    context.commit("setPopoutVisibility", data);
  },
  setFile(context, file) {
    context.commit("setFileToUpload", file);
  },
  setImagePreviewURL(context, url) {
    context.commit("setImagePreviewURL", url);
  },
  setServerIDContextMenu(context, serverID) {
    context.commit("setServerIDContextMenu", serverID);
  },
  setGenericMessage(context, message) {
    context.commit("setGenericMessage", message);
  },
  setEditMessage(context, data) {
    context.commit("setEditMessage", data);
  },
  setServerMemberContext(context, { uniqueID, x, y, serverID }) {
    context.commit("setServerMemberContext", { uniqueID, x, y, serverID });
  }
};

const mutations = {
  setAllPopout(state, data) {
    Vue.set(state, "allPopout", data);
  },
  setServerMemberContext(state, data) {
    Vue.set(state, "serverMemberContext", data);
  },
  setEditMessage(state, data) {
    Vue.set(state, "editMessage", data);
  },
  setGenericMessage(state, message) {
    Vue.set(state, "genericMessage", message);
  },
  setServerSettings(state, { serverID, tab }) {
    Vue.set(state, "serverSettings", { serverID, tab });
  },
  setUserInformationPopout(state, id) {
    Vue.set(state, "userInformationPopoutID", id);
  },
  setPopoutVisibility(state, data) {
    Vue.set(state, data.name, data.visibility);
  },
  setFileToUpload(state, file) {
    Vue.set(state, "fileToUpload", file);
  },
  setImagePreviewURL(state, url) {
    Vue.set(state, "ImagePreviewURL", url);
  },
  setServerIDContextMenu(state, serverID) {
    Vue.set(state, "serverIDContextMenu", serverID);
  }
};

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
};
