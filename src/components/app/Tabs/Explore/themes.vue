<template>
  <div class="themes-tab">
    <div class="items-main-container">
      <div class="note">Themes below are safe and manually reviewed.</div>
      <div class="items-container">
        <spinner class="spinner" v-if="!publicThemes" :size="80" />
        <div class="items">
          <theme-template
            v-for="theme in publicThemes"
            :key="theme.id"
            :theme="theme"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import themeTemplate from "./themesTemplate";
import exploreService from "@/services/exploreService";
import Spinner from "@/components/Spinner";

export default {
  components: { themeTemplate, Spinner },
  data() {
    return {
      publicThemes: null,
      params: "?verified=true"
    };
  },
  methods: {
    async getThemesList() {
      this.publicThemes = null;
      const { ok, result } = await exploreService.getThemes();
      if (ok) {
        this.publicThemes = result.data;
      }
    }
  },
  mounted() {
    this.getThemesList();
  }
};
</script>

<style lang="scss" scoped>
.themes-tab {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}
.items-main-container {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.items-container {
  display: block;
  align-content: center;
  align-items: center;
  max-width: 1066px;
  margin: auto;
  width: 100%;
  .items {
    margin-top: 40px;
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill, 250px);
    grid-auto-rows: min-content;
    align-items: stretch;
    justify-content: space-evenly;
    user-select: none;
  }
}
.spinner {
  align-self: center;
}

.note {
  background: rgba(52, 116, 255, 0.658);
  padding: 5px;
  text-align: center;
}
</style>
