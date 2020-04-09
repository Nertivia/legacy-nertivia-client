import Vue from "vue";

const state = {
  members: {},
  presences: {},
  customStatusArr: {}
};

const getters = {
  members(state) {
    return state.members;
  },
  presences(state) {
    return state.presences;
  },
  customStatusArr(state) {
    return state.customStatusArr;
  }
};

const actions = {
  updateCustomStatus(context, { uniqueID, custom_status }) {
    context.commit("UPDATE_CUSTOM_STATUS", { uniqueID, custom_status });
  },
  addCustomStatusArr(context, customStatusArr) {
    context.commit("ADD_CUSTOM_STATUS_ARR", customStatusArr);
  },
  addPresences(context, presences) {
    context.commit("ADD_PRESENCES", presences);
  },
  updatePresence(context, { uniqueID, status }) {
    context.commit("UPDATE_PRESENCE", { uniqueID, status });
  },
  addMembers(context, membersOBJ) {
    context.commit("ADD_MEMBERS", membersOBJ);
  },
  addMember(context, member) {
    context.commit("ADD_MEMBER", member);
  },
  removeMember(context, uniqueID) {
    context.commit("REMOVE_MEMBER", uniqueID);
  },
  updateAvatar(context, { uniqueID, avatarID }) {
    context.commit("UPDATE_AVATAR", { uniqueID, avatarID });
  }
};

const mutations = {
  ADD_CUSTOM_STATUS_ARR(state, customStatusArr) {
    state.customStatusArr = { ...state.customStatusArr, ...customStatusArr };
  },
  UPDATE_CUSTOM_STATUS(state, { uniqueID, custom_status }) {
    Vue.set(state.customStatusArr, uniqueID, custom_status);
  },
  ADD_PRESENCES(state, presences) {
    state.presences = { ...state.presences, ...presences };
  },
  UPDATE_PRESENCE(state, { uniqueID, status }) {
    Vue.set(state.presences, uniqueID, status);
  },
  ADD_MEMBERS(state, membersOBJ) {
    state.members = Object.assign(state.members, membersOBJ);
  },
  ADD_MEMBER(state, member) {
    state.members[member.uniqueID] = member;
  },
  REMOVE_MEMBER(state, uniqueID) {
    delete state.members[uniqueID];
  },
  UPDATE_AVATAR(state, { uniqueID, avatarID }) {
    state.members[uniqueID].avatar = avatarID;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
