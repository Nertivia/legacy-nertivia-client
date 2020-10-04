<template>
  <div class="dark-background admin-editor-popout" @mousedown="backgroundClick">
    <div class="inner">
      <div class="details">
        <div>
          <span class="name">{{ $t("username") }}: </span>{{ popoutDetails.user.username }}
        </div>
        <div>
          <span class="name">Email: </span>{{ popoutDetails.user.email }}
        </div>
        <div><span class="name">IP: </span>{{ popoutDetails.user.ip }}</div>
      </div>
      <custom-input
        theme="light"
        class="input"
        type="password"
        autocomplete="new-password"
        v-model="password"
        :name="$t('confirm-password')"
      />
      <custom-input
        theme="light"
        class="input"
        type="textarea"
        v-model="reason"
        :name="$('suspend-reason')"
      />
      <div class="button" v-if="!confirmSuspend" @click="suspendUserButton">
        $t("suspend-user")
      </div>
      <div class="button" v-else @click="suspendUserButton">{{ $t("are-you-sure") }}</div>
    </div>
  </div>
</template>

<script>
import AdminService from "@/services/adminService";
import CustomInput from "@/components/global/CustomInput";

export default {
  components: { CustomInput },
  data() {
    return {
      confirmSuspend: false,
      password: "",
      reason: ""
    };
  },
  methods: {
    closeMenu() {
      this.$store.dispatch("setAllPopout", {
        show: false,
        type: null,
        uniqueID: null
      });
    },
    backgroundClick(e) {
      if (e.target.classList.contains("dark-background")) {
        this.closeMenu();
      }
    },
    async suspendUserButton() {
      if (!this.confirmSuspend) {
        this.confirmSuspend = true;
        return;
      }
      const { ok } = await AdminService.suspendUser(
        this.popoutDetails.user.uniqueID,
        this.password,
        this.reason
      );
      if (ok) {
        this.closeMenu();
      }
    }
  },
  async mounted() {},
  computed: {
    popoutDetails() {
      return this.$store.getters.popouts.allPopout;
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/global";
.dark-background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  justify-content: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 111111111;
  display: flex;
}
.inner {
  margin: auto;
  // max-height: 460px;
  // width: 500px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  color: white;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background: $other-box-color;
  border-radius: 4px;
  backdrop-filter: blur(5px);
  overflow: auto;
  align-items: center;
}
.button {
  margin-top: 10px;
  background: $primary-button-color;
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
}
.input {
  max-width: 300px;
  width: 100%;
  margin-top: 20px;
}
.details {
  white-space: break-spaces;
}
.name {
  opacity: 0.6;
  font-weight: bold;
}
@media (max-height: 458px) {
  .inner {
    margin: initial;
  }
}
</style>
