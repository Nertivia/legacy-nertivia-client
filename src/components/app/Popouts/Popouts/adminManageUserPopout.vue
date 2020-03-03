<template>
  <div class="dark-background admin-editor-popout" @mousedown="backgroundClick">
    <div class="inner">
      <div>{{ popoutDetails.user.username }}</div>
      <div>{{ popoutDetails.user.email }}</div>
      <div>{{ popoutDetails.user.ip }}</div>
      <input
        type="password"
        autocomplete="new-password"
        v-model="password"
        placeholder="Confirm Password"
      />
      <textarea v-model="reason" placeholder="Suspend Reason"></textarea>
      <div class="button" v-if="!confirmSuspend" @click="suspendUserButton">
        Suspend User
      </div>
      <div class="button" v-else @click="suspendUserButton">Are you sure?</div>
    </div>
  </div>
</template>

<script>
import AdminService from "@/services/adminService";

export default {
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
  // max-height: 460px;
  // height: 100%;
  // width: 500px;
  padding: 50px;
  display: flex;
  flex-direction: column;
  color: white;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background: linear-gradient(
    to bottom,
    rgba(0, 87, 153, 0.8) 0,
    rgba(0, 118, 209, 0.8)
  );
  border-radius: 4px;
  backdrop-filter: blur(5px);
  overflow: hidden;
  align-items: center;
}
.button {
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
}
input {
  width: initial;
}
</style>
