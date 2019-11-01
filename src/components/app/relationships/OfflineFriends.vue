<template>
  <div class="friends">
    <div class="tab" @click="expanded = !expanded">
      <Tab :expanded="expanded" tabname="Offline" />
    </div>
    <transition name="list">
      <div v-if="expanded" class="list">
        <FriendsTemplate
          v-for="(friend, key) of friends"
          :key="key"
          :channel-i-d="friend.channelID"
          :recipient="friends[key].recipient"
          :tree="true"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import Tab from "./Tab.vue";
import FriendsTemplate from "./FriendsTemplate.vue";
export default {
  components: {
    Tab,
    FriendsTemplate
  },
  data() {
    return {
      expanded: true
    };
  },
  computed: {
    friends() {
      const allFriend = this.$store.getters.user.friends;
      const members = this.$store.getters["members/members"];
      const presences = this.$store.getters["members/presences"];
      const result = Object.keys(allFriend).map(function(key) {
        allFriend[key].recipient = members[allFriend[key].uniqueID];
        return allFriend[key];
      });
      return result.filter(
        friend =>
          friend.status == 2 &&
          (!presences[friend.uniqueID] || presences[friend.uniqueID] == 0)
      );
    }
  }
};
</script>
<style scoped>
.list-enter-active,
.list-leave-active {
  transition: 0.3s;
}
.list-enter, .list-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(-20px);
  opacity: 0;
}

.friends {
  background-color: rgba(0, 0, 0, 0);
  user-select: none;
  padding-bottom: 3px;
  border-radius: 5px;
  transition: 0.3s;
}
.tab {
  transition: 0.3s;
}
.tab:hover {
  background: #08616b;
}
</style>


