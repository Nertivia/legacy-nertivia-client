<template>
  <div class="panel">
    <div class="information">
      Sad to see you go :( If you found something you didnt like, please
      consider reporting to GitHub issues page or join the Nertivia server.
    </div>
    <div class="title">What will get deleted:</div>
    <ul>
      <li>Username</li>
      <li>Email</li>
      <li>Avatar</li>
      <li>Hashed IP</li>
      <li>Hashed Password</li>
      <li>About me</li>
      <li>Custom Status</li>
      <li>Google Drive Token</li>
    </ul>
    <div class="title">What wont get deleted:</div>
    <ul>
      <li>Your messages sent to public servers</li>
      <li>And more</li>
    </ul>
    <div class="title">Requirements:</div>
    <ul>
      <li>Leave/Delete all servers <span>(Right click on a server)</span></li>
      <li>Delete all bots <span>(Settings - My Bots)</span></li>
    </ul>
    <div class="status amber" v-if="met === null">
      Checking if you meet the Requirements...
    </div>
    <div class="status warn" v-if="met === false">
      You do not meet the requirements. Please follow the requirements above.
    </div>
    <div class="status green" v-if="met === true">
      Your requirements are met. You are free to go 😭
    </div>

    <div class="you-can-go" v-if="met === true">
      <div class="error" v-if="error">{{ error }}</div>
      <custom-input
        theme="light"
        class="input"
        type="password"
        v-model="confirmPassword"
        name="Confirm Password"
      />
      <div class="button" v-if="!sure" @click="sure = true">
        Delete My Account
      </div>
      <div class="button" v-if="sure" @click="deleteAccount">I Am Sure</div>
    </div>
  </div>
</template>

<script>
import botsService from "../../../../../services/botsService";
import CustomInput from "@/components/global/CustomInput";
import AuthenticationService from "@/services/AuthenticationService";
export default {
  components: { CustomInput },
  data() {
    return {
      bots: [],
      clickedBotIndex: undefined,
      errors: undefined,
      met: null,
      confirmPassword: "",
      sure: false,
      error: ""
    };
  },
  async mounted() {
    setTimeout(async () => {
      const servers = Object.values(this.$store.getters["servers/servers"]);
      if (servers.length) {
        this.met = false;
        return;
      }
      const { ok, result } = await botsService.getBots();
      if (ok) {
        if (result.data.length) {
          this.met = false;
          return;
        }
      }
      this.met = true;
    }, 1000);
  },
  methods: {
    async deleteAccount() {
      this.error = "";
      const { ok, error } = await AuthenticationService.deleteAccount(
        this.confirmPassword
      );
      if (ok) {
        // this.$store.dispatch("logout");
        // location.href = "/";
        return;
      }
      if (error.response && error.response.data.error) {
        this.error = error.response.data.error;
        return;
      }
      this.error = "Unknown error has occored.";
    }
  }
};
</script>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.information {
  padding: 10px;
}
.title {
  margin-left: 10px;
  font-weight: bold;
}
.status {
  margin-left: 10px;
}
.warn {
  color: rgb(255, 72, 72);
}
.amber {
  color: rgb(255, 145, 72);
}
.green {
  color: rgb(72, 182, 255);
}
li span {
  opacity: 0.5;
}
.you-can-go {
  display: flex;
  flex-direction: column;

  margin: 10px;
}
.button {
  background: rgba(255, 50, 50, 0.5);
  padding: 5px;
  margin: 5px;
  margin-left: 0;
  align-self: flex-start;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background: rgba(255, 50, 50, 0.822);
  }
}
.error {
  color: rgb(255, 78, 78);
  margin-bottom: 5px;
}
</style>
