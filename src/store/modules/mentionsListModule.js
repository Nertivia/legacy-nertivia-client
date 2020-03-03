import Vue from "vue";

const state = {
  array: null,
  index: 0
};

const getters = {
  mentionsArray(state) {
    return state.array;
  },
  getMentionIndex(state) {
    return state.index;
  }
};

const actions = {
  setMentionsArray(context, array) {
    context.commit("setMentionsArray", array);
  },
  changeIndex(context, index) {
    context.commit("changeIndex", index);
  }
};

const mutations = {
  setMentionsArray(state, array) {
    Vue.set(state, "array", array);
  },
  changeIndex(state, index) {
    Vue.set(state, "index", index);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
