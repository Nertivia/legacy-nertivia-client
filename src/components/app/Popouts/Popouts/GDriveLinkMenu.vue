<template>
  <div class="dark-background GDrive-popout" @click="backgroundClick">
    <div class="inner">
      <div class="text">
        {{ $t("GDrive-notice") }}
      </div>
      <div class="images">
        <div class="image GDrive-img" />
        <div class="arrow">
          >
        </div>
        <div class="image nertivia-img" />
      </div>
      <div class="buttons">
        <div class="button deny" @click="closeMenu">
          {{ $t("no-thanks") }}
        </div>
        <div class="button" @click="link">
          {{ $t("link") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import settingsService from "@/services/settingsService";

export default {
  methods: {
    closeMenu() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "GDLinkMenu",
        visibility: false
      });
    },
    backgroundClick(e) {
      if (e.target.classList.contains("dark-background")) {
        this.closeMenu();
      }
    },
    async link() {
      const { ok, result } = await settingsService.GDriveURL();
      if (ok) {
        const { url } = result.data;
        window.open(url, "_blank");
      }
    },
    donateButton() {
      window.open("https://www.paypal.me/DiscordDevHelp", "_blank");
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
  background: rgba(0, 0, 0, 0.7);
  z-index: 11111111133451111;
  display: flex;
}
.inner {
  margin: auto;
  height: 420px;
  width: 400px;
  background: rgb(32, 32, 32);
  display: flex;
  flex-direction: column;
  color: white;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background: $other-box-color;
  border-radius: 4px;
  backdrop-filter: blur(5px);
}
.text {
  color: white;
  text-align: center;
  margin-top: 30px;
  font-size: 17px;
  padding-left: 10px;
  padding-right: 10px;
  user-select: none;
}

.images {
  display: flex;
  margin: auto;
  margin-top: 40px;
}
.image {
  width: 120px;
  height: 120px;
  background-position: center;
  background-size: 100%;
}
.nertivia-img {
  background-image: url(./../../../../assets/logo.png);
  border-radius: 50%;
  background-size: 100%;
}
.arrow {
  font-size: 40px;
  margin: auto;
  padding: 20px;
  user-select: none;
}
.GDrive-img {
  background-image: url(./../../../../assets/Google_Drive_logo.webp);
}
.buttons {
  margin: auto;
  display: flex;
}
.button {
  display: inline-block;
  margin: auto;
  background: $primary-button-color;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  transition: 0.3s;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 4px;
}
.donate {
  background: rgb(218, 179, 6);
}

.button:hover {
  background: $primary-button-color;
  opacity: 0.8;
}
.donate:hover {
  background: rgb(199, 164, 6);
}
.button.deny {
  background: rgb(255, 32, 32);
}
.button.deny:hover {
  background: rgb(255, 53, 53);
}
</style>
