import {bus} from '../../main'
import {router} from './../../router'
import Vue from 'vue';


const state = {

}

const actions = {
  socket_error(context, error) {
    // if the token is invalid.
    if (error === "Authentication error") {
      context.commit('logout')
      router.push({ path: '/' })
    }
  },
  socket_success(context, data) {

    const {message, user, dms, notifications, currentFriendStatus, settings} = data;
    const friendsArray = user.friends;
    const friendObject = {};

    // convert array into object and add online status.
    if(friendsArray !== undefined && friendsArray.length >=1) {
      for (let index = 0; index < friendsArray.length; index++) {
        const element = friendsArray[index];
        if (element.recipient) {
          friendObject[element.recipient.uniqueID] = element;
          for (let currentFriendStatus of currentFriendStatus){
            if(currentFriendStatus[0] == element.recipient.uniqueID){
              friendObject[element.recipient.uniqueID].recipient.status = currentFriendStatus[1]
            }
          }
        }
      }
      data.user.friends = friendObject;
    }

    context.commit('user', data.user)

    // convert dms array to object
    const channelsObject = {}
    if (dms && dms.length >=1) {
      for (let channel of dms) {
        channelsObject[channel.channelID] = channel;
      }
    }
    context.commit('addAllChannels', channelsObject)
    context.dispatch('addAllNotifications', notifications)
    context.dispatch('settingsModule/setSettings', settings)
    

  },
  socket_relationshipAdd(context, friend) {
    context.commit('addFriend', friend)
  },
  socket_relationshipAccept(context, uniqueID) {
    context.commit('acceptFriend', uniqueID)
  },
  socket_relationshipRemove(context, uniqueID) {
    context.commit('removeFriend', uniqueID)
  },
  socket_receiveMessage(context, data) {
    if (context.getters.messages[data.message.channelID]) {
      context.dispatch('updateChannelLastMessage', data.message.channelID);
      context.dispatch('addMessage', {
        message: data.message,
        channelID: data.message.channelID,
        tempID: data.tempID
      })
    }
    if (context.rootState.channelModule.selectedChannelID == data.message.channelID && document.hasFocus()) {
      this._vm.$socket.emit('notification:dismiss', {channelID: data.message.channelID});
    }
    // send notification if other users message the recipient
    if (data.message.creator.uniqueID === context.getters.user.uniqueID) return;
    const notification  = {
      channelID: data.message.channelID,
      lastMessageID: data.message.messageID,
      sender: data.message.creator
    }
    context.dispatch('messageCreatedNotification', notification);
  },
  socket_userStatusChange(context, data) {
    context.commit('userStatusChange', data)
  },
  socket_multiDeviceStatus(context, data) {
    context.commit('changeStatus', data.status)
  },
  socket_disconnect(context) {
    context.commit('user', null)
  },
  socket_multiDeviceUserAvatarChange(context, data) {
    context.commit('changeAvatar', data.avatarID);
  },
  socket_userAvatarChange(context, data) {
    context.commit('userAvatarChange', data)
  },
  ['socket_channel:created'](context, data){
    const {channel} = data;
    // rename to 'channel' to setchannel
    context.dispatch('channel', channel);
  },
  ['socket_notification:dismiss'](context, data){
    const {channelID} = data;
    context.dispatch('dismissNotification', channelID);
  },
  ['socket_googleDrive:linked'](context) {
    context.dispatch('setPopoutVisibility', {name: 'GDLinkMenu', visibility: false})
    context.dispatch('settingsModule/setGDriveLinked', true)
  },
  ['socket_customEmoji:uploaded'](context, emoji) {
    context.dispatch('settingsModule/addCustomEmoji', emoji)
  },
  ['socket_customEmoji:remove'](context, emoji) {
    context.dispatch('settingsModule/removeCustomEmoji', emoji)
  },
  ['socket_customEmoji:rename'](context, emoji) {
    context.dispatch('settingsModule/renameCustomEmoji', emoji)
  }
}

export default {
  namespace: true,
  actions
}