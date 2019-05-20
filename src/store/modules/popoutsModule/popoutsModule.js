import axios from 'axios'
import Vue from 'vue'
import {
  bus
} from '@/main'
import VueRouter from 'vue-router';
import NotificationSounds from '@/utils/notificationSound';

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
}

const getters = {
  popouts(state) {
    return state;
  }
}

const actions = {
  setUserInformationPopout({commit}, id){
    commit('setUserInformationPopout', id)
  },
  setPopoutVisibility(context, data) {
    context.commit('setPopoutVisibility', data)
  },
  setFile(context, file) {
    context.commit('setFileToUpload', file);
  },
  setImagePreviewURL(context, url) {
    context.commit('setImagePreviewURL', url);
  },
  setServerIDContextMenu(context, serverID) {
    context.commit('setServerIDContextMenu', serverID);
  }
}

const mutations = {
  setUserInformationPopout(state, id) {
    Vue.set(state, 'userInformationPopoutID', id)
  },
  setPopoutVisibility(state, data) {
    Vue.set(state, data.name, data.visibility)
  },
  setFileToUpload(state, file) {
    Vue.set(state, 'fileToUpload', file);
  },
  setImagePreviewURL(state, url) {
    Vue.set(state, 'ImagePreviewURL', url);
  },
  setServerIDContextMenu(state, serverID) {
    Vue.set(state, 'serverIDContextMenu', serverID);
  }
}

export default {
  namespace: true,
  state,
  getters,
  actions,
  mutations
}