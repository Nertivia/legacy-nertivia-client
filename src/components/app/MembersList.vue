<template>
  <div class="members-list">
    <div class="header">
      <div class="title">
        Members ({{ members.length }})
      </div>
    </div>
    <div class="members">
      <div class="tab" v-if="onlineMembers.length">Online ({{onlineMembers.length}})</div>
        <member-template
          v-for="member in onlineMembers"
          :key="member.member.uniqueID"
          :type="member.type"
          :avatar="member.member.avatar"
          :user="member.member"
        />
      <div class="tab" v-if="offlineMembers.length">Offline ({{offlineMembers.length}})</div>

      <member-template
        v-for="member in offlineMembers"
        :key="member.member.uniqueID"
        :type="member.type"
        :avatar="member.member.avatar"
        :user="member.member"
      />
    </div>
  </div>
</template>

<script>
import MemberTemplate from '@/components/app/MemberTemplate';
export default {
  components: { MemberTemplate },
  computed: {
    members() {
      const members = this.$store.getters['members/members'];
      const serverMembers = this.$store.getters['servers/serverMembers']
      const selectedServerID = this.$store.getters['servers/selectedServerID'];
      const presences = this.$store.getters['members/presences'];

      let filteredSM = serverMembers.filter(sm => sm.server_id === selectedServerID);

      let getMember = filteredSM.map(sm => {
        sm.member = members[sm.uniqueID];

        // attach presense
        if (sm.uniqueID === this.$store.getters.user.uniqueID) {
          sm.presense =  this.$store.getters.user.status || 0
        } else {
          sm.presense =  presences[sm.uniqueID] || 0
        }
        return sm;
      })
      const sort = getMember.sort((a, b) => {
        var nameA = a.member.username.toUpperCase();
        var nameB = b.member.username.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      })
      return sort;

    },
    onlineMembers() {
      return this.members.filter(sm => sm.presense >= 1)
    },
    offlineMembers() {
      return this.members.filter(sm => sm.presense == 0)
    }
  }
}
</script>


<style scoped>

.members-list {
  color: white;
  display: flex;
	flex-direction: column;
  background: rgba(0, 0, 0, 0.6);
  width: 300px;
  height: 100%;
}
.header {
	height: 50px;
	width: 100%;
	background: rgba(0, 0, 0, 0.438);
	display: flex;
  flex-shrink: 0;
}
.header .title {
  user-select: none;
	font-size: 19px;
	margin: auto;
}
.members{
  padding-top: 10px;
  overflow: auto;
}
.tab {
  background: rgba(255, 255, 255, 0.13);
  padding: 5px;
  user-select: none;
  cursor: default;
  color: rgb(200, 200, 200);
  font-size: 15px;
}
</style>

