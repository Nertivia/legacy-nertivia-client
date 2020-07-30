<template>
  <div class="profile-popout">
    <div class="inner">
      <div class="button" @click="openApp">
        <div class="material-icons">message</div>
        Open
      </div>
      <div class="button" @click="logOut">
        <div class="material-icons">exit_to_app</div>
        Logout
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["user"],
  methods: {
    openApp() {
      window.location.href = "/app";
    },
    logOut() {
      localStorage.removeItem("hauthid");
      this.$emit("logout");
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/global";
.profile-popout {
  position: absolute;
  display: flex;
  flex-direction: column;
  left: 0;
  top: 50px;
}
.inner {
  left: -30px;
  top: 15px;
  position: absolute;
  display: flex;
  flex-direction: column;
  background: $box-secondary-color;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.49);
  backdrop-filter: blur(10px);
  border-radius: 5px;
}
.button {
  display: flex;
  align-items: center;
  align-content: center;
  border-radius: 4px;
  padding: 10px;
  user-select: none;
  cursor: pointer;
  transition: 0.2s;
  color: rgba(255, 255, 255, 0.7);
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
  .material-icons {
    margin-right: 5px;
  }
}

@media (max-width: 342px) {
  .inner {
    left: 0;
    right: 0;
    width: 100%;
  }
  .profile-popout {
    left: 0;
    right: 20px;
  }
}
</style>
