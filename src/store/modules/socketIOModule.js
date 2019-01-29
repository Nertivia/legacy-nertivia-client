import {bus} from '../../main'
import {router} from './../../router'

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
    const friendsArray = data.user.friends;
    const friendObject = {};
    if(friendsArray !== undefined && friendsArray.length >=1) {
      for (let index = 0; index < friendsArray.length; index++) {
        const element = friendsArray[index];
        friendObject[element.recipient.uniqueID] = element;
        for (let currentFriendStatus of data.currentFriendStatus){
          if(currentFriendStatus[0] == element.recipient.uniqueID){
            friendObject[element.recipient.uniqueID].recipient.status = currentFriendStatus[1]
          }
        }
      }
      data.user.friends = friendObject;
    }
    context.commit('user', data.user)

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
    context.dispatch('addMessage', {
      message: data.message,
      channelID: data.message.channelID,
      tempID: data.tempID
    })
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
  }
}

export default {
  namespace: true,
  actions
}