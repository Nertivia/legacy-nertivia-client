import { bus } from "../../main";
import { router } from "./../../router";
import Vue from "vue";

const state = {
  members: {},
  presences: {}
};

const getters = {
  members(state) {
    return state.members;
  },
  presences(state) {
    return state.presences;
  }

};

const actions = {

  addPresences(context, presences) {
    context.commit('ADD_PRESENCES', presences);
  },
  updatePresence(context, {uniqueID, status}) {
    context.commit('UPDATE_PRESENCE', {uniqueID, status});
  },
  addMembers(context, membersOBJ) {
    context.commit('ADD_MEMBERS', membersOBJ);
  },
  addMember(context, member) {
    context.commit('ADD_MEMBER', member);
  },
  removeMember(context, uniqueID) {
    context.commit('REMOVE_MEMBER', uniqueID);
  },
  updateAvatar(context, {uniqueID, avatarID}) {
    context.commit('UPDATE_AVATAR', {uniqueID, avatarID});
  },
};

const mutations = {
  ADD_PRESENCES(state, presences){
    state.presences = {...state.presences, ...presences}
  },
  UPDATE_PRESENCE(state, {uniqueID, status}) {
    Vue.set(state.presences, uniqueID, status);
  },
  ADD_MEMBERS(state, membersOBJ){
    state.members = Object.assign(state.members, membersOBJ);
  },
  ADD_MEMBER(state, member) {
    state.members[member.uniqueID] = member;
  },
  REMOVE_MEMBER(state, uniqueID) {
    delete state.members[uniqueID];
  },
  UPDATE_AVATAR(state, {uniqueID, avatarID}) {
    state.members[uniqueID].avatar = avatarID;
  },

};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
