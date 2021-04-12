<template>
  <div class="content server-bans">
    <div class="content-inner">
      <div class="banned-members-list">
        <spinner v-if="bans === null" />

        <div class="member" v-for="(ban, index) in bans" :key="index">
          <profile-picture
            class="avatar"
            :id="ban.user.id"
            :avatar="ban.user.avatar"
            size="30px"
            :hover="true"
            animation-padding="4px"
          />

          <div class="details" @click="showProfile(ban.user.id)">
            <div class="username">{{ ban.user.username }}</div>
            <div class="tag">@{{ ban.user.tag }}</div>
          </div>
          <div class="unban-button" @click="unban(ban.user.id)">
            {{ unbanStatus ? "Unbanning..." : "Unban" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ServerService from "@/services/ServerService";
import ProfilePicture from "@/components/global/ProfilePictureTemplate";
import Spinner from "@/components/global/Spinner";
import config from "@/config";

export default {
  components: { Spinner, ProfilePicture },
  data() {
    return {
      CDNDomain: config.nertiviaCDN,
      unbanStatus: false,
      bans: null
    };
  },
  methods: {
    async getBanList() {
      const { ok, result } = await ServerService.memberBans(
        this.server.server_id
      );
      if (ok) {
        this.bans = result.data;
      }
    },
    async unban(id) {
      this.unbanStatus = true;
      const { ok } = await ServerService.unBanMember(
        this.server.server_id,
        id
      );
      this.unbanStatus = false;
      if (ok) {
        this.bans = this.bans.filter(b => b.user.id !== id);
      }
    },
    showProfile(id) {
      this.$store.dispatch("setUserInformationPopout", id);
    }
  },
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      return this.$store.getters["servers/servers"][serverID];
    }
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
  margin-top: 30px;
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
    height: 30px;
    padding: 5px;
    align-content: center;
    align-items: center;
    flex-shrink: 0;
    &:hover {
      background: rgba(255, 255, 255, 0.1);
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
      font-weight: bold;
    }
  }
}
@media (max-width: 614px) {
  .content-inner {
    margin-top: 0;
  }
}
</style>
