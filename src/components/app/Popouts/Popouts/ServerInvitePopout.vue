<template>
  <div
    class="dark-background server-invite-popout"
    @mousedown="backgroundClick"
  >
    <div class="inner">
      <div class="top">
        <div class="button" @click="createInviteButton">
          Create New Invite
        </div>
      </div>
      <div class="bottom">
        <div class="title">
          Invites created by you:
        </div>
        <spinner v-if="invites === null" />
        <div v-if="invites !== null" class="invite-list">
          <div
            v-for="invite in invites.slice().reverse()"
            :key="invite"
            class="invite"
          >
            <span class="link">https://nertivia.tk/invites/</span>{{ invite }}
            <div class="copy-button" @click="copy(invite)">Copy</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/global/Spinner.vue";
import ServerService from "@/services/ServerService";

export default {
  components: { Spinner },
  data() {
    return {
      invites: null
    };
  },
  async mounted() {
    // get invites created by you
    const { ok, result } = await ServerService.getInvites(this.serverID);
    if (ok) {
      let invites = [];
      for (let invite of result.data) {
        invites.push(invite.invite_code);
      }
      this.invites = invites;
    }
  },
  methods: {
    closeMenu() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "showServerInviteMenu",
        visibility: false
      });
    },
    backgroundClick(e) {
      if (e.target.classList.contains("dark-background")) {
        this.closeMenu();
      }
    },
    async createInviteButton() {
      if (!this.serverID) {
        console.log("Server ID is not defined");
        return;
      }
      const { ok, result } = await ServerService.postInvite(this.serverID);
      if (ok) {
        this.invites.push(result.data.invite_code);
      }
    },
    copy(invite) {
      this.$clipboard("https://nertivia.tk/invites/" + invite);
    }
  },
  computed: {
    serverID() {
      return this.$store.getters.popouts.allPopout.serverID;
    }
  }
};
</script>

<style scoped>
.dark-background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.541);
  z-index: 111111;
  display: flex;
}
.inner {
  margin: auto;
  height: 400px;
  width: 400px;
  display: flex;
  flex-direction: column;
  color: white;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background: linear-gradient(
    to bottom,
    rgba(0, 87, 153, 0.8) 0,
    rgba(0, 118, 209, 0.8)
  );
  border-radius: 4px;
  backdrop-filter: blur(5px);
}
.top {
  display: flex;
  width: 100%;
  min-height: 100px;
  background: rgba(0, 0, 0, 0.171);
  flex-shrink: 0;
}

.button {
  padding: 10px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  margin: auto;
  transition: 0.3s;
  user-select: none;
  cursor: pointer;
}
.button:hover {
  background: rgba(0, 0, 0, 0.5);
}

.bottom {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.title {
  margin: 10px;
  user-select: none;
}
.invite-list {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  height: 100%;
}
.invite {
  display: flex;
  background: rgba(0, 0, 0, 0.274);
  margin: 1px;
  margin-left: 0;
  margin-right: 0;
  padding: 10px;
}
.link {
  color: rgba(255, 255, 255, 0.5);
}

.copy-button {
  display: flex;
  margin: auto;
  margin-right: 0;
  flex-shrink: 0;
  cursor: pointer;
  opacity: 0.7;
  transition: 0.2s;
}
.copy-button:hover {
  opacity: 1;
}
</style>
