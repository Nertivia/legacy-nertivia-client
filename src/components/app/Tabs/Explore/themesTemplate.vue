<template>
  <div class="item" @mouseenter="hover = true" @mouseleave="hover = false">
    <div class="top">
      <div
        @click="bannerImageClicked"
        class="background-dark"
        :style="{
          backgroundImage: `url(${bannerDomain + theme.screenshot}${
            !hover ? '?type=webp' : ''
          })`
        }"
      />
    </div>
    <div class="bottom">
      <div class="name">
        <div class="name-container" :title="theme.theme.name">
          <span class="inner-name">{{ theme.theme.name }}</span>
        </div>
      </div>
      <div class="description">{{ theme.description }}</div>
      <div class="buttons">
        <!-- <div class="stars-button">
          <div class="material-icons">star</div>
          {{theme.stars}}
        </div>-->
        <div class="button clone-button" @click="cloneButton">
          <span>{{
            cloneStatus === null
              ? $t("clone")
              : cloneStatus === false
              ? $t("cloning")
              : $t("cloned")
          }}</span>
        </div>
        <div
          class="button copy-button"
          @click="copyButton"
          :title="$t('copy-link')"
        >
          <span class="material-icons">link</span>
        </div>
        <div
          class="button un-apply"
          v-if="appliedTheme === theme.id"
          @click="unApplyButton"
        >
          <span>{{ $t("unapply") }}</span>
        </div>
        <div v-else class="button apply" @click="applyButton">
          <span>{{ $t("apply") }}</span>
        </div>
      </div>
      <div class="created-by">
        {{ this.$t("created-by") }}
        <span @click="openUserInformation">{{ theme.creator.username }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import exploreService from "../../../../services/exploreService";
import ThemeService from "../../../../services/ThemeService";

export default {
  props: ["theme", "appliedTheme"],
  data() {
    return {
      bannerDomain: config.domain + "/media/",
      cloneStatus: null,
      hover: false
    };
  },
  methods: {
    openUserInformation() {
      this.$store.dispatch(
        "setUserInformationPopout",
        this.theme.creator.id
      );
    },
    copyButton() {
      this.$clipboard(`https://nertivia.net/themes/${this.theme.theme.id}`);
    },
    async cloneButton() {
      if (this.cloneStatus === false || this.cloneStatus === true) return;
      this.cloneStatus = false;
      const { result } = await exploreService.applyTheme(this.theme.id);
      const css = result.data.css;
      const name = result.data.theme.name;
      const response = await ThemeService.save({ name, css });
      if (response.ok) {
        this.cloneStatus = true;
      }
    },
    async applyButton() {
      this.$emit("applyTheme", this.theme.id);
    },
    unApplyButton() {
      this.$emit("unapplyTheme", this.theme.id);
    },
    bannerImageClicked() {
      this.$store.dispatch(
        "setImagePreviewURL",
        this.bannerDomain + this.theme.screenshot + "?type=webp"
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/global";
.item {
  position: relative;
  width: 250px;
  height: 350px;
  background: $other-box-color;
  box-shadow: 0px 0px 5px 0px #000000bd;
  margin: 5px;
  border-radius: 4px;
  flex-shrink: 0;
  transition: 0.3s;
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  overflow: hidden;
  .top {
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 5px 0px #000000bd;
    width: 100%;
    height: 150px;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-shrink: 0;
    position: relative;
    .background-dark {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, 0.6);
      background-position: center;
      background-size: cover;
      cursor: pointer;
    }
    .avatar {
      background: rgb(26, 133, 255);
      height: 80px;
      width: 80px;
      border-radius: 50%;
      margin-bottom: 10px;
    }
  }
  .bottom {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: auto;
    flex-shrink: 0;
    .name {
      margin-top: 9px;
      font-size: 21px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      text-align: center;
      display: flex;
      z-index: 999;
      .name-container {
        display: flex;
        margin: auto;
      }
      .inner-name {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .material-icons {
        color: #66e0ff;
        margin-left: 5px;
      }
    }

    .description {
      margin: 10px;
      flex: 1;
      opacity: 0.9;
      overflow: auto;
      font-size: 14px;
      word-break: break-word;
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      flex-shrink: 0;
    }

    .buttons {
      display: flex;
      width: 100%;
      flex-direction: row;
      margin-bottom: 10px;
    }
    .stars-button {
      display: flex;
      align-items: center;
      align-content: center;
      padding-left: 5px;
      padding-right: 5px;
      margin-left: 10px;
      margin-top: 0px;
      border-radius: 4px;
      margin-right: 10px;
      transition: 0.2s;
      flex: 1;
      cursor: pointer;
      background: #ff501bd7;
      &:hover {
        background: #ff501b;
      }
      .material-icons {
        margin-right: 5px;
      }
    }
    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 36px;
      border-radius: 2px;
      background: $primary-button-color;
      transition: 0.2s;
      margin-right: 10px;
      margin-left: 10px;

      &.apply {
        margin-left: 5px;
      }
      cursor: pointer;
      &:hover {
        background: $primary-button-color;
        opacity: 0.8;
      }
      &.selected {
        background: grey;
      }
      &.un-apply {
        margin-left: 5px;
        background: rgba(255, 53, 53, 0.808);
        &:hover {
          background: rgb(255, 53, 53);
        }
      }
      &.clone-button {
        margin-right: 1px;
        flex-shrink: 0;
        width: initial;
        padding-left: 5px;
        padding-right: 5px;
        background: rgba(114, 53, 255, 0.808);
        &:hover {
          background: rgb(124, 53, 255);
        }
      }
      &.copy-button {
        margin-right: 1px;
        margin-left: 5px;
        flex-shrink: 0;
        width: initial;
        padding-left: 5px;
        padding-right: 5px;
        background: rgba(255, 53, 120, 0.808);
        &:hover {
          background: rgb(255, 53, 147);
        }
      }
    }
  }
}
.created-by {
  margin-left: 10px;
  margin-bottom: 5px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  span {
    color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    transition: 0.2s;
    &:hover {
      color: white;
    }
  }
}
</style>
