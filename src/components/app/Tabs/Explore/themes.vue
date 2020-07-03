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
            :appliedTheme="appliedTheme"
            @applyTheme="applyTheme"
            @unapplyTheme="unapplyTheme"
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
import Spinner from "@/components/global/Spinner";
const zip = () => import("@/utils/zip");

export default {
  components: { themeTemplate, Spinner },
  data() {
    return {
      publicThemes: null,
      params: "?verified=true",
      appliedTheme: null
    };
  },
  methods: {
    async unapplyTheme() {
      this.appliedTheme = null;
      localStorage.removeItem("appliedThemeId");
      document.getElementById("theme").outerHTML = "";
    },
    async applyTheme(id) {
      // get css
      const { ok, result } = await exploreService.applyTheme(id);
      if (ok) {
        const css = result.data.css;
        const id = result.data.id;
        // save to local storage.
        localStorage.setItem("appliedThemeId", id);

        const styleEl = document.createElement("style");
        styleEl.classList.add("theme-" + id);
        styleEl.id = "theme";
        zip().then(utils => {
          styleEl.innerHTML = utils.unzip(css) || css;

          const currentStyle = document.getElementById("theme");
          if (currentStyle) {
            currentStyle.outerHTML = styleEl.outerHTML;
          } else {
            document.head.innerHTML += styleEl.outerHTML;
          }
          this.appliedTheme = id;
        });
      }
    },
    async getThemesList() {
      this.publicThemes = null;
      const { ok, result } = await exploreService.getThemes();
      if (ok) {
        this.publicThemes = result.data;
      }
    }
  },
  mounted() {
    this.appliedTheme = localStorage.getItem("appliedThemeId");
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
