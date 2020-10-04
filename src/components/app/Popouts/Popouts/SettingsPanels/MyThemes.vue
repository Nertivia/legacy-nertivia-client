<template>
  <div class="container my-themes-popout">
    <make-public
      v-if="showMakePublic"
      @back="closeButton"
      :name="name"
      :themeID="selectedThemeID"
    />
    <Editor
      v-else-if="editing"
      :themeName="name"
      :themeCode="code"
      :savingStatus="saving"
      @close="closeButton"
      @save="saveButton"
    />
    <div class="managing" v-else>
      <div class="bar">
        <div class="button" @click="exploreButton">
          <div class="material-icons">explore</div>
          {{ $t("explore") }}
        </div>
        <div class="button" @click="createButton">
          <div class="material-icons">add</div>
          {{ $t("create") }}
        </div>
      </div>
      <spinner v-if="!themes" />
      <div v-if="themes" class="themes-list">
        <theme-template
          v-for="theme in themes"
          :theme="theme"
          :selectedThemeID="selectedThemeID"
          @clicked="themeClick(theme.id, theme.name)"
          @apply="applyButton(theme.id)"
          @edit="editButton(theme.id)"
          @makePublic="makePublicButton(theme.id)"
          @delete="deleteButton(theme.id)"
          :key="theme.id"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "@/main";
import ThemeTemplate from "./MyThemeTemplate";
import Editor from "./themesEditor";
import MakePublic from "./MyThemesMakePublic";
import Spinner from "@/components/global/Spinner";
import { unzip, zip } from "@/utils/zip";

import ThemeService from "@/services/ThemeService";
export default {
  components: {
    Spinner,
    Editor,
    ThemeTemplate,
    MakePublic
  },
  data() {
    return {
      name: "",
      code: "",
      saving: false,
      selectedThemeID: null,
      themes: null,
      editing: null,
      showMakePublic: false
    };
  },
  methods: {
    async fetchThemes() {
      this.themes = null;
      // fetch themes
      const { ok, result } = await ThemeService.getThemes();
      if (ok) {
        this.themes = result.data;
      }
    },
    createButton() {
      this.name = "Untitled";
      this.code = `/* Start writing your styles*/\n`;
      this.editing = true;
    },
    closeButton() {
      this.showMakePublic = false;
      this.editing = false;
      this.fetchThemes();
    },
    themeClick(id, name) {
      if (this.selectedThemeID === id) {
        this.selectedThemeID = null;
        this.name = null;
      } else {
        this.selectedThemeID = id;
        this.name = name;
      }
    },
    async saveButton({ name, css }) {
      if (this.saving) {
        return;
      }
      this.saving = true;
      this.name = name;
      const base64 = zip(css);

      if (typeof this.editing === "string") {
        await ThemeService.update({ name, css: base64 }, this.editing);
        this.applyButton(this.editing);
      } else {
        const response = await ThemeService.save({ name, css: base64 });
        this.editing = response.result.data.id;
        this.applyButton(response.result.data.id, base64);
      }
      this.saving = false;
    },
    async applyButton(id, base64) {
      if (base64) {
        this.code = unzip(base64);
      } else {
        const { ok, result } = await ThemeService.getTheme(id);
        if (ok) {
          this.code = unzip(result.data.css) || result.data.css;
        }
      }
      // save to local storage.
      localStorage.setItem("appliedThemeId", id);

      const styleEl = document.createElement("style");
      styleEl.classList.add("theme-" + id);
      styleEl.id = "theme";
      styleEl.innerHTML = this.code;

      const currentStyle = document.getElementById("theme");
      if (currentStyle) {
        currentStyle.outerHTML = styleEl.outerHTML;
      } else {
        document.head.innerHTML += styleEl.outerHTML;
      }
    },
    async editButton(id) {
      // fetch theme
      const { ok, result } = await ThemeService.getTheme(id);
      if (ok) {
        const { name, css } = result.data;
        this.name = name;
        this.code = unzip(css) || css;
        this.editing = id;
      }
    },
    async deleteButton(id) {
      localStorage.removeItem("appliedThemeId");
      const themeEl = document.getElementById("theme");
      if (themeEl && themeEl.classList.contains("theme-" + id)) {
        document.getElementById("theme").outerHTML = "";
      }
      const { ok } = await ThemeService.delete(id);
      if (ok) {
        this.themes = this.themes.filter(t => t.id !== id);
      }
    },
    makePublicButton() {
      this.showMakePublic = true;
    },
    exploreButton() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "settings",
        visibility: false
      });
      bus.$emit("tab:switch", 0);
    }
  },
  async mounted() {
    this.fetchThemes();
  },
  computed: {
    user() {
      return this.$store.getters.user;
    }
  }
};
</script>
<style scoped lang="scss">
.container {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
}
.managing {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.bar {
  display: flex;
  width: 100%;
  border-bottom: solid 1px rgba(255, 255, 255, 0.6);
  height: 40px;
  flex-shrink: 0;
  .button {
    display: flex;
    flex-shrink: 0;
    align-content: center;
    align-items: center;
    height: 100%;
    user-select: none;
    cursor: pointer;
    padding-left: 5px;
    padding-right: 5px;
    transition: 0.2s;
    &.end {
      margin: auto;
      margin-right: 0;
    }
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    .material-icons {
      margin-right: 5px;
    }
  }
}
.themes-list {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
