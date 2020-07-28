<template>
  <div id="app">
    <custom-header />
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
        <a class="button github" href="https://github.com/supertiger1234/" target="_blank" rel="noopener noreferrer">
          <img class="icon" src="@/assets/github-logo.svg" alt />
          <div class="name">View In GitHub</div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import Changelog from '@/components/homePage/Changelog'
import CustomHeader from '@/components/homePage/Header'
export default {
	components: {Changelog, CustomHeader}
}
</script>

<style scoped lang="scss">
@import "@/styles/global";
#app {
  color: white;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.center-box {
  display: flex;
  margin: auto;
}
.slideshow {
  display: flex;
  flex-direction: column;
  height: 370px;
  width: 370px;
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
  height: 370px;
	width: 370px;
	margin: 10px;
}
a {
  text-decoration: none;
}
.button {
  display: flex;
  align-items: center;
  align-content: center;
  padding: 10px;
  font-size: 14px;
  transition: 0.2s;
  box-shadow: 0 0 13px 0 black;
	background: $primary-button-color;
	align-items: center;
	justify-content: center;
  user-select: none;
	align-content: center;
  margin: 5px;
  cursor: pointer;
  border-radius: 4px;
  .material-icons {
    margin-right: 5px;
  }

  &.github {
    background: white;
    align-self: center;
    color: black;
    .name {
      margin-left: 5px;
      color: black;
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
@media (max-width: 780px) {
  .slideshow {
    border: none;
    width: 100%;
    flex-shrink: 0;
    margin: 0;
  }
  .main-content {
    width: 400px;
    margin: 0;
  }
  .center-box {
    flex-direction: column;
    width: 400px;
  }
}

@media (max-width: 403px) {
  .main-content, .center-box {
    width: 100%;
  }
}
@media (max-width: 306px) {
  .buttons {
    flex-direction: column;
  }
}
</style>