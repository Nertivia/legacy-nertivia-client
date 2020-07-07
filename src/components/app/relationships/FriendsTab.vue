<template>
  <div class="friends">
    <virtual-list :size="50" :remain="20" v-if="loaded" :variable="true">
      <div class="tab" v-if="friends[0].length" :style="{ height: '25px' }">
        {{$t('pending')}}
      </div>
      <pending-template
        v-for="friend of friends[0]"
        :key="friend.recipient.uniqueID"
        :friend="friend"
        :style="{ height: '55px' }"
      />
      <div class="tab" v-if="friends[1].length || friends[2].length">
        {{$t('online')}}
      </div>
      <div
        class="none-online"
        :style="{ height: '29px' }"
        v-if="!friends[1].length && friends[2].length"
      >
        {{$t('offline-message')}}
      </div>
      <friends-template
        v-for="friend of friends[1]"
        :key="friend.recipient.uniqueID"
        :friend="friend"
        :recipient="friend.recipient"
        :style="{ height: '50px' }"
      />
      <div class="tab">{{$t('offline')}}</div>
      <div
        class="none-online"
        :style="{ height: '29px' }"
        v-if="!friends[2].length && !friends[1].length"
      >
        {{$t('add-friends-message')}}
      </div>
      <friends-template
        v-for="friend of friends[2]"
        :key="friend.recipient.uniqueID"
        :friend="friend"
        :recipient="friend.recipient"
        :style="{ height: '50px' }"
      />
    </virtual-list>
  </div>
</template>

<script>
import VirtualList from "vue-virtual-scroll-list";
import FriendsTemplate from "./FriendsTemplate.vue";
import PendingTemplate from "./PendingTemplate.vue";
export default {
  components: {
    FriendsTemplate,
    PendingTemplate,
    VirtualList
  },
  data() {
    return {
      loaded: false
    };
  },
  mounted() {
    setTimeout(() => (this.loaded = true));
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    channels() {
      const json = this.$store.getters.channels;
      const notifications = this.$store.getters.notifications;

      const keys = Object.keys(json);
      let result = [];
      keys.forEach(key => {
        if (
          json[key].recipients &&
          json[key].recipients.length > 0 &&
          !json[key].server_id &&
          json[key].recipients[0].uniqueID !== this.user.uniqueID
        )
          result.push(json[key]);
      });

      result.sort(function(a, b) {
        const notificationA = notifications.find(item => {
          return item.channelID === a.channelID;
        });
        const notificationB = notifications.find(item => {
          return item.channelID === b.channelID;
        });
        // make notifications more prority.
        if (notificationA) return -1;
        if (notificationB) return 1;
        if (a.lastMessaged === undefined) return 1;
        if (b.lastMessaged === undefined) return -1;
        return b.lastMessaged - a.lastMessaged;
      });

      // gets unopened dms
      const notificationsFiltered = notifications.filter(item => {
        if (json[item.channelID] && json[item.channelID].server_id) return;
        const find = result.find(resFind => {
          return resFind.channelID === item.channelID;
        });
        if (!find) {
          return true;
        }
      });
      for (let index in notificationsFiltered) {
        notificationsFiltered[index].creator = "dummy";
        notificationsFiltered[index].recipients = [
          notificationsFiltered[index].sender
        ];
      }
      result = notificationsFiltered.concat(result);
      return result;
    },
    friends() {
      const allFriends = Object.values(this.$store.getters.user.friends);
      const members = this.$store.getters["members/members"];
      const presences = this.$store.getters["members/presences"];

      let pendingFriends = [];
      let onlineFriends = [];
      let offlineFriends = [];
      for (let index = 0; index < allFriends.length; index++) {
        let friend = allFriends[index];
        const presence = presences[friend.uniqueID];
        friend.recipient = members[friend.uniqueID];

        if (friend.status < 2) {
          pendingFriends.push(friend);
          continue;
        }
        if (!presence || presence === 0) {
          offlineFriends.push(friend);
          continue;
        }
        onlineFriends.push(friend);
      }
      return [pendingFriends, onlineFriends, offlineFriends];
    }
  }
};
</script>
<style scoped>
.friends {
  background-color: rgba(0, 0, 0, 0);
  user-select: none;
  transition: 0.3s;

  display: flex;
  flex-direction: column;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
}
.tab {
  display: flex;
  align-items: center;
  height: 25px;
  color: rgba(255, 255, 255, 0.9);
  padding-left: 10px;
}
.none-online {
  color: rgba(255, 255, 255, 0.7);
  align-self: center;
  padding: 5px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.spacer {
  display: flex;
  height: 5px;
}
</style>
