<template>
  <div
    class="dark-background"
    @mousedown="backgroundClick"
  >
    <div class="inner">
      <div class="tabs">
        <div
          :class="{tab: true, selected: tab == 0}"
          @click="tab = 0; slideBack(); "
        >
          Create
        </div>
        <div
          :class="{tab: true, selected: tab == 1 || tab == 2}"
          @click="tab = 1; slideForward();"
        >
          Join
        </div>
      </div>
      <transition-group
        tag="div"
        class="slider"
        :name="slideInDirection"
      >
        <div
          v-if="tab == 0"
          key="add-server"
          class="content"
        >
          <!-- <div class="title">
            Set your server's avatar
          </div> -->
          <profile-picture
            class="avatar"
            size="90px"
            :url="avatar + 'default'"
          />
          <!-- <div class="button">
            Browse Avatar Coming Soon!
          </div> -->
          <div class="input">
            <div class="input-name">
              Server Name
            </div>
            <input
              v-model="serverName"
              type="text"
              placeholder="Server Name"
            >
          </div>
          <span
            v-if="serverNameError"
            class="warn"
          >{{ serverNameError }}</span>
          <div
            class="button create-button"
            @click="createButton"
          >
            Create
          </div>
        </div>
        <div
          v-if="tab == 1"
          key="check-invite"
          class="content"
        >
          <i class="material-icons icon">forum</i>
          <div class="title">
            Join A Server
          </div>
          <div class="input">
            <div class="input-name">
              Invite Code
              <span
                v-if="inviteCodeError"
                class="warn"
              >- {{ inviteCodeError }}</span>
            </div>
            <input
              v-model="inviteCode"
              type="text"
              placeholder="Invite code"
            >
          </div>
          <div
            class="button check-button"
            @click="checkInviteCode"
          >
            Check
          </div>
        </div>
        <div
          v-if="tab == 2"
          key="join-server"
          class="content server"
        >
          <profile-picture
            class="avatar"
            size="100px"
            :url="avatar + server.avatar"
          />
          <div class="server-name">
            {{ server.name }}
          </div>
          <div class="buttons">
            <div
              v-if="!servers[server.server_id]"
              class="button join-button"
              @click="joinButton"
            >
              Join
            </div>
            <div
              v-if="servers[server.server_id]"
              class="button join-button button-clicked"
            >
              Joined
            </div>
            <div
              class="button cancel-button"
              @click="server = null; inviteCode = ''; tab = 1; slideBack();"
            >
              Cancel
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import { bus } from "@/main";
import ServerService from "@/services/ServerService";
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import serversModule from '../../../../store/modules/serversModule';

export default {
  components: { ProfilePicture },
  data() {
    return {
      tab: 0,
      avatar: config.domain + "/avatars/",
      serverName: "",
      serverNameError: null,
      inviteCode: "",
      inviteCodeError: null,
      server: null,
      slideInDirection: "slide-forward"
    };
  },
  computed: {
    servers() {
      return this.$store.getters['servers/servers'];
    }
  },
  methods: {
    closeMenu() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "addServer",
        visibility: false
      });
    },
    backgroundClick(e) {
      if (e.target.classList.contains("dark-background")) {
        this.closeMenu();
      }
    },
    slideForward() {
      this.slideInDirection = "slide-forward";
    },
    slideBack() {
      this.slideInDirection = "slide-back";
    },
    async createButton(event) {
      if (event.target.classList.contains("button-clicked")) return;
      this.serverNameError = null;
      const name = this.serverName.trim();
      if (!name) {
        this.serverNameError = "Enter a name!";
        return;
      }
      event.target.classList.add("button-clicked");
      const { ok, error, result } = await ServerService.post({ name });
      if (ok) {
        this.closeMenu();
      } else {
        if (error.response) {
          this.serverNameError = error.response.data.message;
        } else {
          this.serverNameError = "Something went wrong.";
        }
        event.target.classList.remove("button-clicked");
      }
    },
    async checkInviteCode(event) {
      if (event.target.classList.contains("button-clicked")) return;
      this.inviteCodeError = null;
      const inviteCode = this.inviteCode.trim();
      if (!inviteCode) {
        this.inviteCodeError = "Enter invite code!";
        return;
      }
      event.target.classList.add("button-clicked");

      const { ok, error, result } = await ServerService.getInviteDetail(
        inviteCode
      );

      if (!ok) {
        event.target.classList.remove("button-clicked");
        return (this.inviteCodeError = error.response.data.message);
      }
      event.target.classList.remove("button-clicked");
      this.slideForward();
      this.server = result.data;
      this.tab = 2;
    },
    async joinButton(event) {
      if (event.target.classList.contains("button-clicked")) return;
      event.target.classList.add("button-clicked");
      const { ok, error, result } = await ServerService.joinServer(this.inviteCode)
      if (ok) {
        this.closeMenu();
      }
    }
  }
};
</script>


<style scoped>
.slide-forward-enter-active,
.slide-forward-leave-active {
  transition: 0.3s;
}
.slide-forward-enter {
  transform: translate(100%, 0);
}
.slide-forward-leave-to {
  transform: translate(-100%, 0);
}

.slide-back-enter-active,
.slide-back-leave-active {
  transition: 0.3s;
}
.slide-back-enter {
  transform: translate(-100%, 0);
}
.slide-back-leave-to {
  transform: translate(100%, 0);
}

.slider {
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
}

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
  height: 450px;
  width: 400px;
  background: rgb(32, 32, 32);
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: 10px;
  overflow: hidden;
}
.tabs {
  display: flex;
  justify-content: center;
  padding-top: 15px;
  background: rgb(27, 27, 27);
}
.tab {
  flex-shrink: 0;
  border-radius: 1px;
  padding: 5px;
  padding-bottom: 5px;
  margin-left: 10px;
  margin-right: 10px;
  border-bottom: solid 1px rgba(255, 255, 255, 0);
  user-select: none;
  cursor: pointer;
  transition: 0.3s;
  font-size: 20px;
}
.selected {
  border-bottom: solid 1px white !important;
}
.tab:hover {
  border-bottom: solid 1px rgb(107, 107, 107);
}

.content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  overflow: hidden;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  align-items: center;
  justify-content: center;
}
.input {
  align-self: center;
  margin-top: 15px;
  margin-bottom: 10px;
  background: rgb(44, 44, 44);
  padding: 5px;
  border-radius: 10px;
}
.input input {
  border-radius: 5px;
}
.title {
  text-align: center;
  margin: 20px;
  user-select: none;
}

.avatar {
  align-self: center;
  margin-bottom: 10px;
}

.button {
  padding: 5px;
  background: rgba(25, 151, 255, 0.699);
  border-radius: 5px;
  user-select: none;
  border: none;
  color: white;
  font-size: 17px;
  outline: none;
  transition: 0.2s;
  box-shadow: 3px 3px rgba(23, 112, 255, 0.479);
  align-self: center;
  margin: 5px;
}
.button:hover {
  background: rgb(25, 151, 255);
}
.button:focus {
  background: rgb(25, 151, 255);
}
.button:active {
  background: rgb(25, 151, 255);
  transform: translate(3px, 3px);
  box-shadow: 0px 0px rgba(0, 97, 207, 0.479);
}

.button-clicked {
  background: rgb(126, 126, 126) !important;
  transform: translate(3px, 3px) !important;
  box-shadow: 0px 0px rgba(61, 61, 61, 0.479) !important;
}

.create-button {
  padding: 10px;
}

.title {
  font-size: 20px;
  margin-bottom: 10px;
  user-select: none;
}

.check-button {
  padding: 10px;
}
.warn {
  color: red;
}

.server-name {
  text-align: center;
  font-size: 25px;
  margin-bottom: 40px;
}

.server .buttons {
  display: flex;
  justify-items: center;
  align-content: center;
}
.server .button {
  margin: auto;
  padding: 10px;
  align-self: center;
  justify-content: center;
}

.join-button {
  margin-right: 5px !important;
}

.cancel-button {
  margin-left: 5px !important;
  background: rgba(238, 55, 55, 0.521);
  box-shadow: 3px 3px rgb(85, 28, 28);
}

.cancel-button:hover {
  background: rgb(238, 55, 55);
}
.cancel-button:focus {
  background: rgb(25, 151, 255);
}
.cancel-button:active {
  background: rgb(238, 55, 55);
  transform: translate(3px, 3px);
  box-shadow: 0px 0px rgb(85, 28, 28);
}
.icon {
  font-size: 80px;
  margin-top: 40px;
  margin-bottom: 5px;
}
</style>

