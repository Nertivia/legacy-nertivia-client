<template>
  <div class="members-list">
    <div class="header">
      <div class="title">Members ({{ members.length }})</div>
    </div>
    <transition name="fade" mode="out-in">
      <div class="members" :key="currentServerID" ref="members-list">
        <virtual-list
          :size="49"
          :key="remain"
          :remain="remain"
          :variable="true"
        >
          <div class="roles" v-for="role in serverRoles" :key="role.id">
            <div
              class="tab"
              v-if="serverRoles.length"
              :style="{ color: role.color, height: '29' + 'px' }"
            >
              {{ role.name }} ({{ role.members.length }})
            </div>
            <member-template
              v-for="member in role.members"
              :key="member.member.uniqueID"
              :type="member.type"
              :avatar="member.member.avatar"
              :user="member.member"
              :member="member"
              :style="{ height: '48' + 'px' }"
            />
          </div>

          <div
            class="tab"
            v-if="noneRoleOnlineMembers.length"
            :style="{ color: defaultRole.color, height: '29' + 'px' }"
          >
            {{ defaultRole.name }} ({{ noneRoleOnlineMembers.length }})
          </div>
          <member-template
            v-for="member in noneRoleOnlineMembers"
            :key="member.member.uniqueID"
            :type="member.type"
            :avatar="member.member.avatar"
            :user="member.member"
            :member="member"
            :style="{ height: '48' + 'px' }"
          />

          <div
            class="tab"
            v-if="offlineMembers.length"
            :style="{ height: '29' + 'px' }"
          >
            Offline ({{ offlineMembers.length }})
          </div>
          <member-template
            v-for="member in offlineMembers"
            :key="member.member.uniqueID"
            :type="member.type"
            :avatar="member.member.avatar"
            :user="member.member"
            :member="member"
            :style="{ height: '48' + 'px' }"
          />
        </virtual-list>
      </div>
    </transition>
  </div>
</template>

<script>
import VirtualList from "vue-virtual-scroll-list";
import MemberTemplate from "@/components/app/MemberTemplate";
import windowProperties from "@/utils/windowProperties";

export default {
  components: { MemberTemplate, VirtualList },
  data() {
    return {
      remain: 20
    };
  },
  methods: {
    resize() {
      const memberListHeight = this.$refs["members-list"].clientHeight;
      const memberTemplateHeight = 48;
      this.remain = memberListHeight / memberTemplateHeight;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.resize();
    })
  },
  watch: {
    windowSize() {
      this.resize()
    }
  },
  computed: {
    windowSize() {
      return {
        width: windowProperties.resizeWidth,
        height: windowProperties.resizeHeight
      };
    },
    currentServerID() {
      return this.$store.getters["servers/currentServerID"];
    },
    members() {
      const members = this.$store.getters["members/members"];
      const serverMembers = this.$store.getters["servers/serverMembers"];

      const presences = this.$store.getters["members/presences"];

      let filteredSM = serverMembers.filter(
        sm => sm.server_id === this.currentServerID
      );

      let getMember = filteredSM.map(sm => {
        sm.member = members[sm.uniqueID];

        // attach presense
        if (sm.uniqueID === this.$store.getters.user.uniqueID) {
          sm.presense = this.$store.getters.user.status || 0;
        } else {
          sm.presense = presences[sm.uniqueID] || 0;
        }
        return sm;
      });
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
      });
      return sort;
    },
    onlineMembers() {
      return this.members.filter(sm => sm.presense >= 1);
    },
    roleMembers() {
      let roleMembers = this.onlineMembers.filter(
        sm => sm.roles && sm.roles.length
      );
      return roleMembers;
    },
    noneRoleOnlineMembers() {
      const roles = this.$store.getters["servers/currentServerRoles"];
      return this.onlineMembers.filter(sm => {
        if (!sm.roles || !sm.roles.length) {
          return sm;
        }
        if (!roles.find(r => sm.roles.includes(r.id) && !r.hideRole)) {
          return sm;
        }
        return false;
      });
    },
    serverRoles() {
      const roles = this.$store.getters["servers/currentServerRoles"];
      let newRolesWithMembers = [];

      if (!roles) return undefined;
      // loop through server roles
      for (let index = 0; index < roles.length; index++) {
        const role = { ...roles[index] };

        if (role.hideRole) continue;
        // filter role members
        const members = this.roleMembers.filter(rm => {
          const filteredRoles = roles.filter(r => rm.roles.includes(r.id));
          return filteredRoles.length && filteredRoles[0].id === role.id;
        });

        if (members.length) {
          role.members = members;
          newRolesWithMembers.push(role);
        }
      }
      return newRolesWithMembers;
    },
    defaultRole() {
      const roles = this.$store.getters["servers/currentServerRoles"];
      return roles.find(r => r.default);
    },
    offlineMembers() {
      return this.members.filter(sm => sm.presense == 0);
    }
  }
};
</script>

<style scoped>
.members-list {
  color: white;
  display: flex;
  flex-direction: column;
  width: 300px;
  max-width: calc(100% - 60px);
  height: 100%;
}
.header {
  height: 50px;
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-shrink: 0;
}
.header .title {
  user-select: none;
  font-size: 19px;
  margin: auto;
}
.members {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.tab {
  user-select: none;
  cursor: default;
  color: #b5c4ca;
  font-size: 15px;
  margin-left: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
