import Vue from "vue";

const state = {
  members: {},
  presences: {},
  customStatusArr: {},
  programActivity: {}
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
  },
  programActivity(state) {
    return state.programActivity;
  }
};

const actions = {
  updateProgramActivity(context, { user_id, name, status }) {
    context.commit("UPDATE_PRGORAM_ACTIVITY", { user_id, name, status });
  },
  addProgramActivity(context, programActivityObj) {
    context.commit("ADD_PROGRAM_ACTIVITY", programActivityObj);
  },
  updateCustomStatus(context, { id, custom_status }) {
    context.commit("UPDATE_CUSTOM_STATUS", { id, custom_status });
  },
  addCustomStatusArr(context, customStatusArr) {
    context.commit("ADD_CUSTOM_STATUS_ARR", customStatusArr);
  },
  addPresences(context, presences) {
    context.commit("ADD_PRESENCES", presences);
  },
  updatePresence(context, { id, status }) {
    context.commit("UPDATE_PRESENCE", { id, status });
  },
  addMembers(context, membersOBJ) {
    context.commit("ADD_MEMBERS", membersOBJ);
  },
  addMember(context, member) {
    context.commit("ADD_MEMBER", member);
  },
  removeMember(context, id) {
    context.commit("REMOVE_MEMBER", id);
  },
  updateAvatar(context, { id, avatarID }) {
    context.commit("UPDATE_AVATAR", { id, avatarID });
  },
  updateMember(context, data) {
    context.commit("UPDATE_MEMBER", data);
  }
};

const mutations = {
  ADD_PROGRAM_ACTIVITY(state, programActivityObj) {
    state.programActivity = { ...state.programActivity, ...programActivityObj };
  },
  ADD_CUSTOM_STATUS_ARR(state, customStatusArr) {
    state.customStatusArr = { ...state.customStatusArr, ...customStatusArr };
  },
  UPDATE_PRGORAM_ACTIVITY(state, { user_id, name, status }) {
    if (!name) {
      Vue.delete(state.programActivity, user_id);
    } else {
      Vue.set(state.programActivity, user_id, { name, status });
    }
  },
  UPDATE_CUSTOM_STATUS(state, { id, custom_status }) {
    Vue.set(state.customStatusArr, id, custom_status);
  },
  ADD_PRESENCES(state, presences) {
    state.presences = { ...state.presences, ...presences };
  },
  UPDATE_PRESENCE(state, { id, status }) {
    Vue.set(state.presences, id, status);
  },
  ADD_MEMBERS(state, membersOBJ) {
    state.members = Object.assign(state.members, membersOBJ);
  },
  ADD_MEMBER(state, member) {
    state.members[member.id] = member;
  },
  REMOVE_MEMBER(state, id) {
    delete state.members[id];
  },
  UPDATE_AVATAR(state, { id, avatarID }) {
    state.members[id].avatar = avatarID;
  },
  UPDATE_MEMBER(state, data) {
    const newMembers = state.members;
    newMembers[data.id] = { ...newMembers[data.id], ...data };
    state.members = Object.assign({}, newMembers);
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
