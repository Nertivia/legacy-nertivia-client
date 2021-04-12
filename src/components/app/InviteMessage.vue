<template>
  <div
    class="invite-content"
    :class="{ verified: inviteDetail && inviteDetail.verified }"
  >
    <div class="pfp" v-if="inviteDetail">
      <profile-picture
        class="avatar"
        size="50px"
        animationPadding="0"
        :avatar="inviteDetail.avatar"
        :id="inviteDetail.server_id"
        :hover="true"
      />

      <div
        class="verified"
        v-if="inviteDetail && inviteDetail.verified"
        title="Verified Server"
      >
        <span class="material-icons">check</span>
      </div>
    </div>
    <div class="name" v-if="inviteDetail === undefined">
      Getting Invite Details...
    </div>
    <div class="name" v-if="inviteDetail === null">Invalid Invite</div>
    <div class="info" v-if="inviteDetail">
      <div class="name">{{ inviteDetail.name }}</div>
      <div class="button" v-if="joinedServer" @click="visitServer">Visit</div>
      <div class="button" v-else @click="joinServer">Join</div>
    </div>
  </div>
</template>

<script>
import ServerService from "@/services/ServerService";
import ProfilePicture from "@/components/global/ProfilePictureTemplate";
import config from "../../config";
import { bus } from "../../main";

export default {
  components: { ProfilePicture },
  props: ["invite"],
  data() {
    return {
      avatarDomain: config.nertiviaCDN,
      inviteDetail: undefined
    };
  },
  methods: {
    async joinServer() {
      await ServerService.joinServer(this.invite[2], {
        socketID: this.$socket.client.id
      });
    },
    visitServer() {
      bus.$emit("openServer", this.inviteDetail.server_id);
    }
  },
  async mounted() {
    const code = this.invite[2];
    const { ok, result } = await ServerService.getInviteDetail(code);
    if (!ok) {
      this.inviteDetail = null;
    } else {
      this.inviteDetail = result.data;
    }
  },
  computed: {
    joinedServer() {
      if (!this.inviteDetail) return;
      return this.$store.getters["servers/servers"][
        this.inviteDetail.server_id
      ];
    }
  }
};
</script>

<style scoped lang="scss">
.pfp {
  position: relative;
  .verified {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background-color: #267dff;
    border-radius: 50%;
    right: 0px;
    bottom: 0px;
    position: absolute;
    user-select: none;
    .material-icons {
      color: #ffffff;
      font-size: 12px;
    }
  }
}
.invite-content {
  display: flex;
  background: #ffffff21;
  padding: 10px;
  max-width: 200px;
  margin-top: 5px;
  align-items: center;
  align-content: center;
  height: 50px;
}

.invite-content .material-icons {
  font-size: 40px;
}
.verified .avatar {
  border: solid 3px rgba(30, 146, 255, 0.856);
}
.avatar {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
}
.info {
  margin-left: 10px;
}
.button {
  background: rgba(0, 0, 0, 0.2);
  padding: 3px;
  display: inline-block;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.2s;
  margin-top: 5px;
  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
