import config from '@/config';
import {bus} from '../../main'
import {router} from './../../router'
import Vue from 'vue';
import DesktopNotification from '@/utils/ElectronJS/DesktopNotification'

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

    const {message, user, serverMembers, dms, notifications, currentFriendStatus, settings} = data;


    const friendsArr = user.friends;

    const presence = {};
    const friendObj = {};
    const memberObj = {};
    if (friendsArr) {
      for ( let friend of friendsArr ){
        const member = friend.recipient;
        delete friend.recipient;
        friend.uniqueID = member.uniqueID;
        friendObj[member.uniqueID] = friend;
        memberObj[member.uniqueID] = member;
      }
    }
    if (currentFriendStatus) {
      for (const _presence of currentFriendStatus) {
        presence[_presence[0]] = _presence[1];
      }
    }

    context.dispatch('members/addPresences', presence);

    context.dispatch('members/addMembers', memberObj);




    // const friendsArray = user.friends;
    // const friendObject = {};

    // // convert array into object and add online status.
    // if(friendsArray !== undefined && friendsArray.length >=1) {
    //   for (let index = 0; index < friendsArray.length; index++) {
    //     const element = friendsArray[index];
    //     if (element.recipient) {
    //       friendObject[element.recipient.uniqueID] = element;
    //       for (let currentFriendStatus of currentFriendStatus){
    //         console.log(currentFriendStatus[0], currentFriendStatus[1])
    //         if(currentFriendStatus[0] == element.recipient.uniqueID){
    //           friendObject[element.recipient.uniqueID].recipient.status = currentFriendStatus[1]
    //         }
    //       }
    //     }
    //   }
    // }

    let servers = user.servers || [];
    //convert array to object for servers
    servers = servers.reduce((obj, item) => {
      item.channels.forEach(element => {
        element.server = undefined
        element._id = undefined;
        element.__v = undefined;
        element.server_id = item.server_id


        context.dispatch('channel', element)
        context.dispatch("servers/AddChannelsIDs", {
          serverID: item.server_id,
          channelsIDs: [element.channelID]
        });
      });
      item.channels = undefined;
      obj[item.server_id] = item
      return obj
    }, {})

    context.dispatch('servers/setServers', servers)

    data.user.servers = undefined;
    data.user.friends = friendObj;

    context.commit('user', data.user)

    
    
    //server members
    let serverMembersArr = [];
    let membersObj = {};
    for (let serverMember of serverMembers) {
      const member = serverMember.member;
      delete serverMember.member;
      serverMember.uniqueID = member.uniqueID;
      serverMembersArr.push(serverMember);
      membersObj[member.uniqueID] = member;
    }
    context.dispatch('members/addMembers', membersObj);
    context.dispatch( 'servers/addServerMembers', serverMembersArr )


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
    const member = friend.recipient;
    delete friend.recipient;
    friend.uniqueID = member.uniqueID;
    context.dispatch('members/updatePresence', {uniqueID: member.uniqueID, status: member.status})
    delete member.status;
    context.dispatch('members/addMember', member)
    context.commit('addFriend', friend)
  },
  socket_relationshipAccept(context, uniqueID) {
    context.commit('acceptFriend', uniqueID)
  },
  socket_relationshipRemove(context, uniqueID) {
    context.commit('removeFriend', uniqueID)
  },
  socket_receiveMessage(context, data) {
    if (context.getters.channels[data.message.channelID]){
      context.dispatch('updateChannelLastMessage', data.message.channelID);
    }
    if (context.getters.messages[data.message.channelID]) {
      context.dispatch('addMessage', {
        message: data.message,
        channelID: data.message.channelID,
        tempID: data.tempID
      })
    }
    if (context.rootState.channelModule.selectedChannelID == data.message.channelID && document.hasFocus()) {
      this._vm.$socket.emit('notification:dismiss', {channelID: data.message.channelID});
    } else {
      bus.$emit('title:change', data.message.creator.username + " sent a message.");
      desktopNotification();
    }
    // send notification if other users message the recipient
    if (data.message.creator.uniqueID === context.getters.user.uniqueID) return;
    const notification  = {
      channelID: data.message.channelID,
      lastMessageID: data.message.messageID,
      sender: data.message.creator
    }
    context.dispatch('messageCreatedNotification', notification);
    function desktopNotification() {
      // send desktop notification
      const disableDesktopNotification = context.rootGetters['settingsModule/settings'].notification.disableDesktopNotification;
      if (disableDesktopNotification === true) return
      const channel = context.getters.channels[data.message.channelID];
      if (channel.server_id) {
        const server = context.getters['servers/servers'][channel.server_id]
        DesktopNotification.serverMessage({
          serverName: server.name,
          channelName: channel.name,
          username: data.message.creator.username,
          avatarURL: config.domain + '/avatars/' + server.avatar,
          message: data.message.message
        })
      } else {
        DesktopNotification.directMessage({
          username: data.message.creator.username,
          avatarURL: config.domain + '/avatars/' + data.message.creator.avatar,
          message: data.message.message
        })
      }
    }
  },
  socket_userStatusChange(context, data) {
    if (context.rootState.user.user.uniqueID === data.uniqueID) return;
    context.dispatch('members/updatePresence', {uniqueID: data.uniqueID, status: data.status})
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
    context.commit('members/updateAvatar', data)
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
  },
  ['socket_survey:completed'](context) {
    context.dispatch('surveyCompleted');
  },
  ['socket_server:joined'](context, server) {
    context.dispatch('servers/setServer', server)

    const channels = server.channels;

    for (let index = 0; index < channels.length; index++) {
      const element = channels[index];
      element.server = undefined;
      element.server_id = server.server_id;
      context.dispatch('channel', element)
      context.dispatch("servers/AddChannelsIDs", {
        serverID: server.server_id,
        channelsIDs: [element.channelID]
      });
    }

  },
  ['socket_server:leave'](context, {server_id}) {
    context.dispatch('servers/removePresences', server_id);
    context.dispatch('servers/removeServer', server_id)
    context.dispatch('servers/removeNotifications', server_id)
    context.dispatch('servers/removeAllServerChannels', server_id)
  },
  ['socket_server:memberAdd'](context, {serverMember, presence}) { // member_add
    let sm = Object.assign({}, serverMember);
    const member = sm.member;
    delete sm.member;
    sm.uniqueID = member.uniqueID;

    context.dispatch('members/updatePresence', {uniqueID: member.uniqueID, status: presence})
    context.dispatch('members/addMember', member)
    context.dispatch('servers/addServerMember', sm)
  },
  ['socket_server:memberRemove'](context, {uniqueID, server_id}) { // member_remove
    context.dispatch('servers/removeServerMember', {uniqueID, server_id})
  },
  ['socket_server:members'](context, {serverMembers, memberPresences}) { // members
    let serverMembersArr = [];
    let members = {};
    for (let serverMember of serverMembers) {
      const member = serverMember.member;
      delete serverMember.member;
      serverMember.uniqueID = member.uniqueID;
      serverMembersArr.push(serverMember);
      members[member.uniqueID] = member;
    }
    context.dispatch('members/addMembers', members);
    context.dispatch('servers/addServerMembers', serverMembers)
    let presences = {};
    for (const _presence of memberPresences) {
      presences[_presence[0]] = _presence[1];
    }
    context.dispatch('members/addPresences', presences);
  },
  ['socket_server:addChannel'](context, {channel}) { // add_channel
    context.dispatch('channel', channel);
    context.dispatch('servers/AddChannelsIDs', {serverID: channel.server_id, channelsIDs: [channel.channelID]})
  },
  ['socket_server:updateChannel'](context, {name, channelID}) { // update_channel
    context.dispatch('updateChannel', {name, channelID});
  },
  ['socket_server:removeChannel'](context, {server_id, channelID}) {
    context.dispatch('servers/removeServerChannel', {server_id, channelID});
    context.dispatch('dismissNotification', channelID);
  },
  ['socket_server:updateServer'](context, data) {
    context.dispatch('servers/updateServer', {server_id: data.server_id, server: data});
  },
  ['socket_updateMessage'](context, data) {
    context.dispatch('updateMessage', {channelID: data.channelID, messageID: data.messageID, message: data});
  },
  ['socket_deleteMessage'](context, {channelID, messageID}) {
    context.dispatch('deleteMessage', {channelID, messageID})
  },
}

export default {
  namespace: true,
  actions
}