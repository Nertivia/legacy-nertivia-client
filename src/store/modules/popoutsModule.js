import axios from 'axios'
import Vue from 'vue'
import {
  bus
} from '../../main'
import VueRouter from 'vue-router';
import NotificationSounds from '@/notificationSound';

const state = {
  fileToUpload: null,
  uploadDialog: false,
  ImagePreviewURL: null,

  dragDropFileUploadDialog: false,
  settings: false,
  GDLinkMenu: false,
}

const getters = {
  popouts(state) {
    return state;
  }
}

const actions = {
  setPopoutVisibility(context, data) {
    context.commit('setPopoutVisibility', data)
  },
  setFile(context, file) {
    context.commit('setFileToUpload', file);
  },
  setImagePreviewURL(context, url) {
    context.commit('setImagePreviewURL', url);
  }
}

const mutations = {
  setPopoutVisibility(state, data) {
    Vue.set(state, data.name, data.visibility)
  },
  setFileToUpload(state, file) {
    Vue.set(state, 'fileToUpload', file);
  },
  setImagePreviewURL(state, url) {
    Vue.set(state, 'ImagePreviewURL', url);
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}