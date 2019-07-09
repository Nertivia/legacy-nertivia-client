<template>
  <div class="members-list">
    <div class="header">
      <div class="title">
        Members ({{ members.length }})
      </div>
    </div>
    <div class="members">
      <member-template
        v-for="(member, index) in members"
        :key="index"
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

      let filteredSM = serverMembers.filter(sm => sm.server_id === selectedServerID);

      let getMember = filteredSM.map(sm => {
        sm.member = members[sm.uniqueID];
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

    }
  }
}
</script>


<style scoped>

.members-list {
  color: white;
  display: flex;
	flex-direction: column;
  background: rgba(0, 0, 0, 0.671);
  width: 300px;
  height: 100%;
}
.header {
	height: 40px;
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
</style>

