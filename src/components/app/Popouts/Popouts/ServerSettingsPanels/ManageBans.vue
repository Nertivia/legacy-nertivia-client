<template>
  <div class="content">
    <div class="content-inner">
      <div class="banned-members-list">
        <spinner v-if="bans === null"/>

        <div class="member" v-for="(ban, index) in bans" :key="index">
          <div class="avatar"  @click="showProfile(ban.user.uniqueID)" :style="`background-image: url(${avatarDomain + ban.user.avatar})`" />
          <div class="details" @click="showProfile(ban.user.uniqueID)">
            <div class="username">{{ban.user.username}}</div>
            <div class="tag">@{{ban.user.tag}}</div>
          </div>
          <div class="unban-button" @click="unban(ban.user.uniqueID)">
            {{unbanStatus ? 'Unbanning...' : 'Unban'}}
          </div>
        </div>
        

      </div>      
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import { bus } from "@/main";
import ServerService from "@/services/ServerService";
import Spinner from "@/components/Spinner";

export default {
  components: {Spinner},
  data() {
    return {
      unbanStatus: false,
      bans: null,
      avatarDomain: config.domain + "/avatars/"   
    };
  },
  methods: {
    async getBanList() {
      const {ok, error, result} = await ServerService.memberBans(this.server.server_id)
      if (ok) {
        this.bans = result.data;
      }
    },
    async unban(uniqueID) {
      this.unbanStatus = true;
      const { ok, error, result } = await ServerService.unBanMember(this.server.server_id, uniqueID)
      this.unbanStatus = false;
      if (ok) {
        this.bans = this.bans.filter(b => b.user.uniqueID !== uniqueID)
      }

    },
    showProfile(uniqueID) {
      this.$store.dispatch("setUserInformationPopout", uniqueID);
    },
  },
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      return this.$store.getters["servers/servers"][serverID];
    },
  },
  mounted() {
    this.getBanList();
  }
};
</script>

<style scoped lang="scss">

.content-inner {
  display: flex;
  height: 100%;
  position: relative;
}

.banned-members-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
  .member {
    display: flex;
    background: #052935;
    height: 30px;
    margin: 5px;
    padding: 5px;
    align-content: center;
    align-items: center;
    flex-shrink: 0;
    .avatar {
      height: 30px;
      width: 30px;
      border-radius: 50%;
      margin-right: 5px;
      flex-shrink: 0;
      background-color: rgba(0, 0, 0, 0.315);
      background-position: center;
      background-size: cover;
      background-repeat: no-repeat;
      cursor: pointer;
    }
    .details {
      display: flex;
      .tag {
        color: rgba(255, 255, 255, 0.568);
      }
      flex: 1;
      overflow: hidden;
      cursor: pointer;

    }
    .unban-button {
      color: rgb(255, 43, 43);
      cursor: pointer;
      user-select: none;
      flex-shrink: 0;
      margin-left: 5px;

    }

  }

}



</style>



