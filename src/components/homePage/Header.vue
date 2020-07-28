<template>
  <div class="header">
    <img class="logo" src="@/assets/transparentLogo.svg" alt />
    <div class="title">Nertivia</div>
    <div class="buttons">
      <div class="button">Log in</div>
      <div class="button join">Join Nertivia</div>
    </div>
  </div>
</template>



<style scoped lang="scss">
@import "@/styles/global";
.header {
  display: flex;
  height: 60px;
  width: 100%;
  align-content: center;
  align-items: center;
}
.buttons {
  display: flex;
  margin: auto;
  margin-right: 10px;
}
.button {
  padding: 10px;
  border-radius: 4px;
  color: rgba(87,160,255,1);
  user-select: none;
  margin: 5px;
  cursor: pointer;
  &.join {
    box-shadow: 0 0 5px 0 black;
    color: white;
    background: $primary-button-color;
    transition: 0.2s;
    &:hover {
      opacity: 0.8;
    }
  }
}
.logo {
  margin-left: 20px;
  margin-right: 10px;
  height: 50px;
  width: 50px;
}
@media (max-width: 374px) {
  .logo {
    display: none;
  }
  .title {
    display: none;
  }
}
</style>