import axios from 'axios'
import Vue from 'vue'
import {
  bus
} from '../../main'
import VueRouter from 'vue-router';
import NotificationSounds from '@/utils/notificationSound';

const state = {
  array: null,
  index: 0,
}

const getters = {
  emojiArray(state) {
    return state.array;
  },
  getEmojiIndex(state) {
    return state.index;
  }
}

const actions = {
  setEmojiArray(context, array) {
    context.commit('setEmojiArray', array)
  },
  changeIndex(context, index) {
    context.commit('changeIndex', index)
  }
}

const mutations = {
  setEmojiArray(state, array) {
    Vue.set(state, "array", array);
  },
  changeIndex(state, index) {
    Vue.set(state, "index", index);
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}