<template>
  <div id="app">
    <div class="center-box">
      <div class="slideshow">
        <img class="logo" src="@/assets/transparentLogo.svg" alt />
        <div class="title">Welcome to Nertivia</div>
      </div>
      <div class="main-content">
        <div class="buttons">
          <div class="button">
            <div class="material-icons">open_in_browser</div>
            <div class="name">Open In Browser</div>
          </div>
          <div class="button">
            <div class="material-icons">vertical_align_bottom</div>
            <div class="name">Download</div>
          </div>
        </div>
				<changelog class="changelog"/>
        <div class="button github">
          <img class="icon" src="@/assets/github-logo.svg" alt />
          <div class="name">View In GitHub</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Changelog from '@/components/homePage/Changelog'
export default {
	components: {Changelog}
}
</script>

<style scoped lang="scss">
@import "@/styles/global";
#app {
  color: white;
  display: flex;
}
.center-box {
  display: flex;
  margin: auto;
}
.slideshow {
  display: flex;
  flex-direction: column;
  height: 350px;
  width: 350px;
	align-items: center;
	margin: 10px;
	justify-content: center;
  align-content: center;
  border-right: solid 1px rgba(255, 255, 255, 0.315);
  .logo {
    height: 200px;
    width: 200px;
  }
  .title {
    text-align: center;
  }
}
.main-content {
  display: flex;
  flex-direction: column;
  height: 350px;
	width: 350px;
	margin: 10px;
}
.button {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 5px;
  font-size: 14px;
  transition: 0.2s;
  box-shadow: 0 0 13px 0 black;
	background: $primary-button-color;
	align-items: center;
	justify-content: center;
	align-content: center;
  margin: 5px;
  cursor: pointer;
  border-radius: 4px;
  &.github {
    background: white;
    align-self: center;
    color: black;
    .name {
      margin-left: 5px;
    }
  }
  .icon {
    height: 30px;
    width: 30px;
  }
  &:hover {
    opacity: 0.8;
  }
}
.buttons {
	display: flex;
	.button {
		flex: 1;
		white-space: pre;
	}
}
.changelog {
	margin-top: 10px;
	margin-bottom: 10px;
}
</style>