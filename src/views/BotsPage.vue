<template>
  <div id="app">
    <div class="app-content">
      <header-login />
      <div class="content">
        <transition appear name="fade-up">
          <div :class="{ box: true, red: bot === undefined }">
            <spinner v-if="bot === null" />
            <div v-if="bot === undefined">
              <div class="invalid">{{ errorMsg }}</div>
            </div>
            <div v-if="bot" class="server">
              <div class="top">
                <profile-picture
                  class="avatar"
                  size="100px"
                  :avatar="bot.avatar"
                  :uniqueID="bot.uniqueID"
                  :hover="true"
                />
                <div class="server-name">{{ bot.username }}</div>
              </div>
              <div class="bottom">
                <div class="perms-box">
                  <div class="sub-title">Permissions:</div>
                  <div class="perms">
                    <div class="perm" v-for="perm in permsFiltered" :key="perm.value">
                      <div class="circle-box" />
                      <div class="name">{{perm.name}}</div>
                    </div>
                  </div>
                </div>
                <drop-down-template
                  v-if="loggedIn"
                  class="dropdown"
                  :items="servers"
                  selectBy="server_id"
                  :selectedItem="selectedServer ? selectedServer.server_id: null"
                  :noneSelect="true"
                  name="Select Server:"
                  @change="selectedServer = $event"
                />
                <div class="buttons">
                  <div
                    v-if="loggedIn"
                    class="button join-button"
                    :class="{disabled: !selectedServer}"
                    @click="addBotButton"
                  >Add bot to server</div>
                  <div v-else class="button join-button" @click="loginButton">Login to add bots</div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import DropDownTemplate from "@/components/app/Popouts/Popouts/ServerSettingsPanels/DropDownMenu";
import HeaderLogin from "@/components/global/HeaderLoginTemplate.vue";
import Spinner from "@/components/global/Spinner.vue";
import ProfilePicture from "@/components/global/ProfilePictureTemplate.vue";
import botsService from "../services/botsService";
import { permissions, containsPerm } from "../utils/RolePermissions";
export default {
  components: { HeaderLogin, Spinner, ProfilePicture, DropDownTemplate },
  data() {
    return {
      mediaDomain: config.domain + "/media/",
      bot: null,
      servers: null,
      selectedServer: null,
      loggedIn: localStorage.getItem("hauthid"),
      errorMsg: "",
      perms: permissions.SEND_MESSAGES.value
    };
  },
  async mounted() {
    const botID = this.$route.params.bot_id;
    const perms = this.$route.query.perms;
    if (perms !== undefined) {
      this.perms = perms;
    }
    const { ok, result, error } = await botsService.getBot(botID, false, true);
    if (ok) {
      if (result.data.bot) {
        this.bot = result.data.bot;
        this.servers = result.data.servers;
      } else {
        this.bot = result.data;
      }
    } else {
      if (error.response === undefined) {
        this.errorMsg = "Cannot connect to server. Try again later.";
      } else {
        this.errorMsg = "Invalid Bot.";
      }
      this.bot = undefined;
    }
  },
  methods: {
    addBotButton() {
      if (!this.selectedServer) return;
      const botID = this.$route.params.bot_id;
      botsService.addBot(botID, this.selectedServer.server_id, this.perms);
      //this.$router.push(`/app`);
    },
    loginButton() {
      const botID = this.$route.params.bot_id;
      this.$router.push(`/login?to=bots&id=${botID}`);
    }
  },
  computed: {
    permsFiltered() {
      return Object.values(permissions).filter(perm =>
        containsPerm(this.perms, perm.value)
      );
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
}
</style>


<style scoped lang="scss">
@import "@/styles/global";
.perms-box {
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 5px;
  .perms {
    margin-top: 5px;
    font-size: 14px;
  }
  .perm {
    display: flex;
    align-items: center;
    align-content: center;
    margin-top: 5px;
    margin-bottom: 5px;
    .circle-box {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background: rgb(0, 153, 255);
      margin-right: 10px;
    }
  }
}

.fade-up-enter-active {
  opacity: 0;
  animation: bounce-in 0.5s;
  animation-delay: 0.7s;
}
.fade-up-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: translateX(30px);
    opacity: 0;
  }
  50% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
#app {
  display: flex;
  flex-direction: column;
  color: white;
  height: 100%;
  background: $bg-color;
}
.app-content {
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: auto;
  z-index: 9999;
  padding-bottom: 100px;
}
.content {
  display: flex;
  height: 100%;
  margin: 10px;
  flex-shrink: 0;
}
.avatar {
  margin-top: 30px;
}
.box {
  width: 100%;
  max-width: 500px;
  margin: auto;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding-bottom: 10px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
}
.server {
  display: flex;
  // flex-direction: column;
  width: 100%;
  align-content: center;
  justify-content: center;
  .top, .bottom {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-content: center;
    justify-content: center;
  }
  .bottom {
    margin-top: 10px;
    margin-right: 10px;
    flex-shrink: 0;
  }
}
.invalid {
  margin-top: 15px;
  align-items: center;
  align-content: center;
  text-align: center;
}

.avatar {
  align-self: center;
  margin-bottom: 10px;
}

.server-name {
  text-align: center;
  font-size: 25px;
  margin-bottom: 10px;
}

.button {
  padding: 10px;
  background: rgba(25, 151, 255, 0.699);
  user-select: none;
  border: none;
  color: white;
  font-size: 17px;
  outline: none;
  transition: 0.2s;
  align-self: center;
  flex-shrink: 0;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 10px;
}
.button:hover {
  background: rgb(25, 151, 255);
}
.button:focus {
  background: rgb(25, 151, 255);
}

.button-clicked {
  background: rgb(126, 126, 126) !important;
}
.button.disabled {
  background: gray;
}
@media (max-width: 528px) {
  .server {
    flex-direction: column;
  }
  .buttons {
    display: flex;
    align-content: center;
    align-items: center;
    flex-direction: column;
  }
  .button {
    width: 70%;
    align-self: center;
  }
}
</style>
