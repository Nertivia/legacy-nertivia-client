<template>
  <div class="theme" v-if="!approved">
    <div
      class="screenshot"
      @click="screenshotClicked"
      :style="{ backgroundImage: `url(${screenshot})` }"
    ></div>
    <div class="details">
      <div class="name"><strong>Name:</strong> {{ theme.theme.name }}</div>
      <strong>Description:</strong>
      <div class="description">{{ theme.description }}</div>
      <div class="buttons">
        <div class="button" v-if="theme.approved" @click="openEditor">
          Compare
        </div>
        <div class="button" v-else @click="openEditor">{{ $t("view-code" ) }}</div>
        <div class="button" v-if="theme.approved" @click="approveButton">
          Update
        </div>
        <div class="button" v-else @click="approveButton">{{ $t("appvove") }}</div>
        <div class="button">Decline</div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import adminService from "@/services/adminService";

export default {
  props: ["theme"],
  data() {
    return {
      approved: false
    };
  },
  computed: {
    screenshot() {
      return config.domain + "/media/" + this.theme.screenshot;
    }
  },
  methods: {
    screenshotClicked() {
      this.$store.dispatch("setImagePreviewURL", this.screenshot);
    },
    openEditor() {
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "ADMIN_CSS_EDITOR",
        id: this.theme.id
      });
    },
    async approveButton() {
      const { ok } = await adminService.approveTheme(this.theme.id);
      if (ok) {
        this.approved = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.theme {
  display: flex;
  flex-direction: column;
  margin: 5px;
  padding: 5px;
  align-items: center;
  border-radius: 4px;
}
.screenshot {
  width: 100%;
  height: 150px;
  background: rgba(0, 0, 0, 0.7);
  flex-shrink: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  margin-bottom: 10px;
  cursor: pointer;
}
.name {
  margin-bottom: 5px;
}
.description {
  max-height: 100px;
  overflow: auto;
}
.buttons {
  margin-top: 10px;
  display: flex;

  flex-shrink: 0;
  .button {
    padding: 10px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    margin: auto;
    margin-right: 5px;
    margin-left: 5px;
    cursor: pointer;
    user-select: none;
    transition: 0.2s;
    &:hover {
      background: rgba(0, 0, 0, 0.3);
    }
  }
}
</style>
